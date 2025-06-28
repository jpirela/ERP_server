// server/api/models/condicion_pago.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const condicion_pago = sequelize.define('condicion_pago', {
    id_condicion_pago: { type: DataTypes.INTEGER },
    descripcion: { type: DataTypes.STRING },
  }, {
    tableName: 'condicion_pago',
    timestamps: false,
  });

  condicion_pago.associate = (models) => {

  };

  return condicion_pago;
};
