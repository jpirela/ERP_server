// server/api/models/instrumento_pregunta.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const instrumento_pregunta = sequelize.define('instrumento_pregunta', {
    id_instrumento: { type: DataTypes.INTEGER },
    id_pregunta: { type: DataTypes.INTEGER },
    fecha_respuesta: { type: DataTypes.DATE },
  }, {
    tableName: 'instrumento_pregunta',
    timestamps: false,
  });

  instrumento_pregunta.associate = (models) => {
    instrumento_pregunta.belongsTo(models.instrumento, { foreignKey: 'id_instrumento' });
    instrumento_pregunta.belongsTo(models.pregunta, { foreignKey: 'id_pregunta' });
  };

  return instrumento_pregunta;
};
