// server/api/models/detalle_pedido.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const detalle_pedido = sequelize.define('detalle_pedido', {
    id_detalle_pedido: { type: DataTypes.INTEGER },
    id_pedido: { type: DataTypes.INTEGER },
    id_producto: { type: DataTypes.INTEGER },
    cantidad: { type: DataTypes.INTEGER },
    precio_unitario: { type: DataTypes.DECIMAL },
  }, {
    tableName: 'detalle_pedido',
    timestamps: false,
  });

  detalle_pedido.associate = (models) => {
    detalle_pedido.belongsTo(models.pedidos, { foreignKey: 'id_pedido' });
    detalle_pedido.belongsTo(models.productos, { foreignKey: 'id_producto' });
  };

  return detalle_pedido;
};
