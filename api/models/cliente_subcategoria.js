// server/api/models/cliente_subcategoria.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const cliente_subcategoria = sequelize.define('cliente_subcategoria', {
    id_cliente: { type: DataTypes.INTEGER },
    id_subcategoria: { type: DataTypes.INTEGER },
    fecha_asignacion: { type: DataTypes.DATE },
  }, {
    tableName: 'cliente_subcategoria',
    timestamps: false,
  });

  cliente_subcategoria.associate = (models) => {
    cliente_subcategoria.belongsTo(models.clientes, { foreignKey: 'id_cliente' });
    cliente_subcategoria.belongsTo(models.subcategoria, { foreignKey: 'id_subcategoria' });
  };

  return cliente_subcategoria;
};
