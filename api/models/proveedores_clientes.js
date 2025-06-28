// server/api/models/proveedores_clientes.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const proveedores_clientes = sequelize.define('proveedores_clientes', {
    id_proveedor: { type: DataTypes.INTEGER },
    id_cliente: { type: DataTypes.INTEGER },
    fecha_asociacion: { type: DataTypes.DATE },
  }, {
    tableName: 'proveedores_clientes',
    timestamps: false,
  });

  proveedores_clientes.associate = (models) => {
    proveedores_clientes.belongsTo(models.proveedores, { foreignKey: 'id_proveedor' });
    proveedores_clientes.belongsTo(models.clientes, { foreignKey: 'id_cliente' });
  };

  return proveedores_clientes;
};
