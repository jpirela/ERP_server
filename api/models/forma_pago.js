// server/api/models/forma_pago.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const forma_pago = sequelize.define('forma_pago', {
    id_forma_pago: { type: DataTypes.INTEGER },
    descripcion: { type: DataTypes.STRING },
  }, {
    tableName: 'forma_pago',
    timestamps: false,
  });

  forma_pago.associate = (models) => {

  };

  return forma_pago;
};
