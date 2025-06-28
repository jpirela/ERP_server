// server/api/models/parroquia.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const parroquia = sequelize.define('parroquia', {
    id_parroquia: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    id_municipio: { type: DataTypes.INTEGER },
  }, {
    tableName: 'parroquia',
    timestamps: false,
  });

  parroquia.associate = (models) => {
    parroquia.belongsTo(models.municipio, { foreignKey: 'id_municipio' });
  };

  return parroquia;
};
