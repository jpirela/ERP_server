// server/api/models/inventario.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const inventario = sequelize.define('inventario', {
    id_movimiento: { type: DataTypes.INTEGER },
    id_producto: { type: DataTypes.INTEGER },
    tipo_movimiento: { type: DataTypes.ENUM('entrada', 'salida') },
    cantidad: { type: DataTypes.INTEGER },
    descripcion: { type: DataTypes.TEXT },
    fecha_movimiento: { type: DataTypes.DATE },
  }, {
    tableName: 'inventario',
    timestamps: false,
  });

  inventario.associate = (models) => {
    inventario.belongsTo(models.productos, { foreignKey: 'id_producto' });
  };

  return inventario;
};
