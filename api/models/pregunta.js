// server/api/models/pregunta.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const pregunta = sequelize.define('pregunta', {
    id_pregunta: { type: DataTypes.INTEGER },
    texto: { type: DataTypes.TEXT },
    fecha_creacion: { type: DataTypes.DATE },
  }, {
    tableName: 'pregunta',
    timestamps: false,
  });

  pregunta.associate = (models) => {

  };

  return pregunta;
};
