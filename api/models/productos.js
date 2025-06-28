// server/api/models/productos.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const productos = sequelize.define('productos', {
    id_producto: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    categoria: { type: DataTypes.STRING },
    codigo_barra: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT },
    precio_compra: { type: DataTypes.DECIMAL },
    precio_venta: { type: DataTypes.DECIMAL },
    stock: { type: DataTypes.INTEGER },
    stock_minimo: { type: DataTypes.INTEGER },
    fecha_vencimiento: { type: DataTypes.DATE },
    id_proveedor: { type: DataTypes.INTEGER },
    id_subcategoria: { type: DataTypes.INTEGER },
    id_tipo_producto: { type: DataTypes.INTEGER },
  }, {
    tableName: 'productos',
    timestamps: false,
  });

  productos.associate = (models) => {
    productos.belongsTo(models.proveedores, { foreignKey: 'id_proveedor' });
    productos.belongsTo(models.subcategoria, { foreignKey: 'id_subcategoria' });
    productos.belongsTo(models.tipo_producto, { foreignKey: 'id_tipo_producto' });
  };

  return productos;
};
