// server/api/models/detalle_venta.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const detalle_venta = sequelize.define('detalle_venta', {
    id_detalle: { type: DataTypes.INTEGER },
    id_venta: { type: DataTypes.INTEGER },
    id_producto: { type: DataTypes.INTEGER },
    cantidad: { type: DataTypes.INTEGER },
    precio_unitario: { type: DataTypes.DECIMAL },
    subtotal: { type: DataTypes.DECIMAL },
  }, {
    tableName: 'detalle_venta',
    timestamps: false,
  });

  detalle_venta.associate = (models) => {
    detalle_venta.belongsTo(models.ventas, { foreignKey: 'id_venta' });
    detalle_venta.belongsTo(models.productos, { foreignKey: 'id_producto' });
  };

  return detalle_venta;
};
