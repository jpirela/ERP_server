// server/api/models/subcategoria.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const subcategoria = sequelize.define('subcategoria', {
    id_subcategoria: { type: DataTypes.INTEGER },
    id_categoria: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT },
  }, {
    tableName: 'subcategoria',
    timestamps: false,
  });

  subcategoria.associate = (models) => {
    subcategoria.belongsTo(models.categoria, { foreignKey: 'id_categoria' });
  };

  return subcategoria;
};
