// server/api/models/categoria.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const categoria = sequelize.define('categoria', {
    id_categoria: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT },
  }, {
    tableName: 'categoria',
    timestamps: false,
  });

  categoria.associate = (models) => {

  };

  return categoria;
};
