// server/api/models/pedidos.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const pedidos = sequelize.define('pedidos', {
    id_pedido: { type: DataTypes.INTEGER },
    id_proveedor: { type: DataTypes.INTEGER },
    fecha_pedido: { type: DataTypes.DATEONLY },
    estado: { type: DataTypes.ENUM('pendiente', 'enviado', 'recibido') },
  }, {
    tableName: 'pedidos',
    timestamps: false,
  });

  pedidos.associate = (models) => {
    pedidos.belongsTo(models.proveedores, { foreignKey: 'id_proveedor' });
  };

  return pedidos;
};
