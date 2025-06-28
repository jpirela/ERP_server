// server/api/models/ventas.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ventas = sequelize.define('ventas', {
    id_venta: { type: DataTypes.INTEGER },
    id_cliente: { type: DataTypes.INTEGER },
    id_usuario: { type: DataTypes.INTEGER },
    fecha_venta: { type: DataTypes.DATE },
    total: { type: DataTypes.DECIMAL },
  }, {
    tableName: 'ventas',
    timestamps: false,
  });

  ventas.associate = (models) => {
    ventas.belongsTo(models.clientes, { foreignKey: 'id_cliente' });
    ventas.belongsTo(models.usuarios, { foreignKey: 'id_usuario' });
  };

  return ventas;
};
