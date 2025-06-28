// server/api/models/detalle_producto.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const detalle_producto = sequelize.define('detalle_producto', {
    id_detalle: { type: DataTypes.INTEGER },
    id_producto: { type: DataTypes.INTEGER },
    cantidad: { type: DataTypes.INTEGER },
    ubicacion: { type: DataTypes.STRING },
    traslado: { type: DataTypes.STRING },
    flete: { type: DataTypes.DECIMAL },
    disposicion: { type: DataTypes.STRING },
    fecha_registro: { type: DataTypes.DATE },
  }, {
    tableName: 'detalle_producto',
    timestamps: false,
  });

  detalle_producto.associate = (models) => {
    detalle_producto.belongsTo(models.productos, { foreignKey: 'id_producto' });
  };

  return detalle_producto;
};
