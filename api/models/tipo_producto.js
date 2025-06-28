// server/api/models/tipo_producto.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const tipo_producto = sequelize.define('tipo_producto', {
    id_tipo_producto: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT },
  }, {
    tableName: 'tipo_producto',
    timestamps: false,
  });

  tipo_producto.associate = (models) => {

  };

  return tipo_producto;
};
