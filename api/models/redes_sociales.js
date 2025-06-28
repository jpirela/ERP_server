// server/api/models/redes_sociales.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const redes_sociales = sequelize.define('redes_sociales', {
    id_red_social: { type: DataTypes.INTEGER },
    id_cliente: { type: DataTypes.INTEGER },
    plataforma: { type: DataTypes.STRING },
    usuario: { type: DataTypes.STRING },
    es_principal: { type: DataTypes.BOOLEAN },
  }, {
    tableName: 'redes_sociales',
    timestamps: false,
  });

  redes_sociales.associate = (models) => {
    redes_sociales.belongsTo(models.clientes, { foreignKey: 'id_cliente' });
  };

  return redes_sociales;
};
