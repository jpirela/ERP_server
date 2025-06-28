// api/controllers/apiControllers.js
import { Op, Sequelize } from 'sequelize';
import { getModels } from '../models/index.js';

const getModel = async (modelName, dbName) => {
  const models = await getModels(dbName);
  return models[modelName] || null;
};

// Función que valida y ajusta la relación de las claves foráneas y primarias de tipos diferentes
const adjustForeignKeyType = (association, model, includeClause) => {
  const foreignKey = association.foreignKey || null;
  const targetKey = association.targetKey || 'id';

  if (foreignKey && targetKey) {
    const foreignKeyAttribute = model?.rawAttributes?.[foreignKey];
    const targetKeyAttribute = association.model?.rawAttributes?.[targetKey];

    if (foreignKeyAttribute && targetKeyAttribute && foreignKeyAttribute.type.key !== targetKeyAttribute.type.key) {
      includeClause.where = {
        ...includeClause.where,
        [Sequelize.col(`${association.as}.${targetKey}`)]: Sequelize.literal(
          `CAST(${model.name}."${foreignKey}" AS ${targetKeyAttribute.type.key})`
        ),
      };
    }
  }
};

const getAssociations = (Model) => {
  return Object.keys(Model.associations || {}).map((associationName) => {
    const association = Model.associations[associationName];
    const foreignKey = association.foreignKey || null;
    const targetKey = association.targetKey || 'id';

    const foreignKeyAttribute = Model.rawAttributes[foreignKey];
    const targetKeyAttribute = association.target.rawAttributes[targetKey];

    let whereClause = undefined;
    if (foreignKeyAttribute && targetKeyAttribute && foreignKeyAttribute.type.key !== targetKeyAttribute.type.key) {
      whereClause = {
        [Sequelize.col(`${association.as}.${targetKey}`)]: Sequelize.literal(
          `CAST(${Model.name}."${foreignKey}" AS ${targetKeyAttribute.type.key})`
        ),
      };
    }

    return {
      model: association.target,
      as: association.as,
      required: false,
      where: whereClause,
    };
  });
};

const processFilters = (filters) => {
  if (!filters || typeof filters !== 'object' || Object.keys(filters).length === 0) return {};

  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value && typeof value === 'object' && value.in) {
      acc[key] = { [Op.in]: value.in };
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export async function getAll(req, res) { 
  try {
    const dbName = req.database;
    const Model = await getModel(req.modelName, dbName);

    if (!Model) {
      return res.status(404).json({ error: `Model not found: ${req.modelName}` });
    }

    const {
      page,
      limit = 50,
      fields,
      sort,
      sortOrder = 'DESC',
      filter = null,
      includeAssociations = 'true',
      includeConfig = '{}',
    } = req.query;

    

    const parsedLimit = parseInt(limit, 10) || 50;
    const noPagination = !page || page === 'Todos' || page === '0';
    const currentPage = noPagination ? 'Todos' : parseInt(page, 10);
    const offset = noPagination ? undefined : (currentPage - 1) * parsedLimit;

    let sortOptions = sort ? [[sort, sortOrder.toUpperCase()]] : [];
    const filterOptions = filter ? processFilters(JSON.parse(filter)) : {};

    let includeOptions = [];

    if (includeAssociations.toLowerCase() === 'true') {
      const parsedIncludeConfig = JSON.parse(includeConfig || '{}');
      const allAssociations = getAssociations(Model);

      includeOptions = allAssociations
        .filter((association) => parsedIncludeConfig.hasOwnProperty(association.as?.toLowerCase()))
        .map((association) => {
          const alias = association.as?.toLowerCase();
          const associationConfig = parsedIncludeConfig[alias] || {};
          
          if (associationConfig.sort) {
            const fields = associationConfig.sort.split(',').map(field => field.trim());
            fields.forEach(field => {
              sortOptions.push([
                { model: association.model, as: association.as },
                field,
                (associationConfig.sortOrder || 'ASC').toUpperCase(),
              ]);
            });
          }

          const includeClause = {
            model: association.model,
            as: association.as,
            where: processFilters(associationConfig.filter || undefined),
            limit: associationConfig.limit || undefined,
            attributes: associationConfig.fields
              ? associationConfig.fields.replace(/\+/g, ',').split(',').map(f => f.trim()) // 🔹 Reemplazo `+` por `,`
              : undefined,
          };

          adjustForeignKeyType(association, Model, includeClause);

          // 🔹 Manejo correcto de asociaciones anidadas
          if (associationConfig.include) {
            let nestedIncludes = associationConfig.include;

            if (typeof nestedIncludes === 'object' && !Array.isArray(nestedIncludes)) {
              nestedIncludes = Object.entries(nestedIncludes).map(([key, value]) => {
                const nestedModel = association.model.associations[key]?.target; // 🔥 Buscar en associations

                return {
                  model: nestedModel,
                  as: key,
                  attributes: value.fields ? value.fields.replace(/\+/g, ',').split(',').map(f => f.trim()) : undefined,
                  order: value.sort ? [[value.sort, (value.sortOrder || 'ASC').toUpperCase()]] : undefined,
                };
              }).filter(item => item !== null); // Filtrar asociaciones no válidas
              
            }

            includeClause.include = nestedIncludes;
          }

          return includeClause;
        });
    }

    const modelAttributes = fields ? fields.split(',').map(field => field.trim()) : undefined;

       
    const queryOptions = {
      where: filterOptions,
      attributes: modelAttributes,
      include: includeOptions.length ? includeOptions : undefined,
      order: sortOptions.length ? sortOptions : undefined,
      limit: noPagination ? undefined : parsedLimit,
      offset: noPagination ? undefined : offset,
    };

    const { rows: items, count: totalRecords } = await Model.findAndCountAll(queryOptions);

    res.status(200).json({
      items,
      totalPages: noPagination ? 1 : Math.ceil(totalRecords / parsedLimit),
      currentPage,
      totalRecords,
      firstRecordIndex: noPagination ? 1 : offset + 1,
      lastRecordIndex: noPagination ? totalRecords : Math.min(offset + parsedLimit, totalRecords),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controlador para obtener un registro por ID
export async function getById(req, res) {
  try {
    const dbName = req.database;
    const Model = await getModel(req.modelName, dbName);

    if (!Model) {
      return res.status(404).json({ error: `Model not found: ${req.modelName}` });
    }

    const item = await Model.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: `${req.modelName} not found` });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controlador para crear un nuevo registro
export async function create(req, res) {
  
  try {
    const dbName = req.database;
    const Model = await getModel(req.modelName, dbName);

    if (!Model) {
      return res.status(404).json({ error: `Model not found: ${req.modelName}` });
    }

    const newItem = await Model.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateById(req, res) {
  try {
    const dbName = req.database;
    const Model = await getModel(req.modelName, dbName);

    if (!Model) {
      return res.status(404).json({ error: `Model not found: ${req.modelName}` });
    }

    const currentRecord = await Model.findByPk(req.params.id);

    if (!currentRecord) {
      return res.status(404).json({ error: `${req.modelName} not found` });
    }

    const noChanges = Object.entries(req.body).every(([key, value]) => currentRecord[key] === value);

    if (noChanges) {
      return res.status(200).json({
        message: 'No changes were made as the provided data matches the existing record.',
        affectedRows: 0,
      });
    }

    const [affectedRows] = await Model.update(req.body, { where: { id: req.params.id } });

    res.json({
      message: 'Update successful',
      affectedRows,
    });
  } catch (error) {
    console.error('Error during update:', error);
    res.status(500).json({ error: error.message });
  }
}

// Controlador para eliminar un registro por ID
export async function deleteById(req, res) {
  try {
    const dbName = req.database;
    const Model = await getModel(req.modelName, dbName);

    if (!Model) {
      return res.status(404).json({ error: `Model not found: ${req.modelName}` });
    }

    const affectedRows = await Model.destroy({ where: { id: req.params.id } });

    if (!affectedRows) {
      return res.status(404).json({ message: `${req.modelName} not found` });
    }

    res.json({ message: `${req.modelName} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Controlador para obtener imágenes de productos con filtros opcionales
export async function getProductImages(req, res) {
  try {
    const dbName = req.database;
    const models = await getModels(dbName);

    const ProductImagesModel = models['products_images_all'];
    const ProductsModel = models['products'];
    const ProductAttributesModel = models['products_attributes'];
    const ProductOptionsModel = models['products_options'];
    const OptionValuesModel = models['options_values'];
    const AttributeValuesModel = models['attributes_values'];

    if (!ProductImagesModel || !ProductsModel) {
      return res.status(404).json({ error: "Model not found" });
    }

    const { 
      fields,
      filter = null,
      sort,
      sortOrder = 'DESC',
    } = req.query;

    console.log(filter);

    const { id, id_attribute = null, id_option = null } = filter ? JSON.parse(filter) : {};
    
    if (!id) {
      return res.status(400).json({ error: "El parámetro id es obligatorio." });
    }

    // Construcción del filtro dinámico
    const whereClause = { id: id };
    if (id_attribute) whereClause['$products_images_all.id_attribute$'] = id_attribute;
    if (id_option) whereClause['$products_images_all.id_option$'] = id_option;

    const productImages = await ProductImagesModel.findAll({
      attributes: [
        'id',
        'id_attribute',
        'id_option',
        'img_path',
        'img_name',
        'img_order_web',
        [Sequelize.col('product_attributes.id'), 'attribute_id'],
        [Sequelize.col('product_options.id'), 'option_id'],
        [Sequelize.col('option_value.value'), 'option_value'],
        [Sequelize.col('attribute_value.value'), 'attribute_value']
      ],
      include: [
        {
          model: ProductsModel,
          as: 'product',
          attributes: [],
          required: true,
          where: whereClause
        },
        {
          model: ProductAttributesModel,
          as: 'product_attributes',
          attributes: [],
          required: true,
          where: Sequelize.where(Sequelize.col('products_images_all.id_attribute'), Sequelize.col('product_attributes.id'))
        },
        {
          model: ProductOptionsModel,
          as: 'product_options',
          attributes: [],
          required: false,
          where: Sequelize.where(Sequelize.col('products_images_all.id_option'), Sequelize.col('product_options.id'))
        },
        {
          model: OptionValuesModel,
          as: 'option_value',
          attributes: [],
          required: false,
          where: Sequelize.where(Sequelize.col('product_options.id'), Sequelize.col('option_value.id_option'))
        },
        {
          model: AttributeValuesModel,
          as: 'attribute_value',
          attributes: [],
          required: true,
          where: Sequelize.where(Sequelize.col('products_images_all.id_attribute'), Sequelize.col('attribute_value.id'))
        }
      ],
      order: [
        ['id_attribute', 'ASC'],
        ['id_option', 'ASC'],
        ['img_order_web', 'ASC']
      ]
    });

    return res.status(200).json(productImages);

  } catch (error) {
    console.error("Error al obtener las imágenes del producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
