// server/api/models/promocion_producto.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const promocion_producto = sequelize.define('promocion_producto', {
    id_promocion_producto: { type: DataTypes.INTEGER },
    id_promocion: { type: DataTypes.INTEGER },
    id_producto: { type: DataTypes.INTEGER },
  }, {
    tableName: 'promocion_producto',
    timestamps: false,
  });

  promocion_producto.associate = (models) => {
    promocion_producto.belongsTo(models.promociones, { foreignKey: 'id_promocion' });
    promocion_producto.belongsTo(models.productos, { foreignKey: 'id_producto' });
  };

  return promocion_producto;
};
