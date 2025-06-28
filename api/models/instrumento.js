// server/api/models/instrumento.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const instrumento = sequelize.define('instrumento', {
    id_instrumento: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT },
    fecha_registro: { type: DataTypes.DATE },
  }, {
    tableName: 'instrumento',
    timestamps: false,
  });

  instrumento.associate = (models) => {

  };

  return instrumento;
};
