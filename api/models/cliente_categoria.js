// server/api/models/cliente_categoria.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const cliente_categoria = sequelize.define('cliente_categoria', {
    id_cliente: { type: DataTypes.INTEGER },
    id_categoria: { type: DataTypes.INTEGER },
    fecha_asignacion: { type: DataTypes.DATE },
  }, {
    tableName: 'cliente_categoria',
    timestamps: false,
  });

  cliente_categoria.associate = (models) => {
    cliente_categoria.belongsTo(models.clientes, { foreignKey: 'id_cliente' });
    cliente_categoria.belongsTo(models.categoria, { foreignKey: 'id_categoria' });
  };

  return cliente_categoria;
};
