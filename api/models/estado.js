// server/api/models/estado.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const estado = sequelize.define('estado', {
    id_estado: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
  }, {
    tableName: 'estado',
    timestamps: false,
  });

  estado.associate = (models) => {

  };

  return estado;
};
