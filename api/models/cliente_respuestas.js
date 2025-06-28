// server/api/models/cliente_respuestas.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const cliente_respuestas = sequelize.define('cliente_respuestas', {
    id_cliente: { type: DataTypes.INTEGER },
    id_pregunta: { type: DataTypes.INTEGER },
    respuesta: { type: DataTypes.TEXT },
    fecha_respuesta: { type: DataTypes.DATE },
  }, {
    tableName: 'cliente_respuestas',
    timestamps: false,
  });

  cliente_respuestas.associate = (models) => {
    cliente_respuestas.belongsTo(models.clientes, { foreignKey: 'id_cliente' });
    cliente_respuestas.belongsTo(models.pregunta, { foreignKey: 'id_pregunta' });
  };

  return cliente_respuestas;
};
