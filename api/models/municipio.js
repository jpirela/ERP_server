// server/api/models/municipio.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const municipio = sequelize.define('municipio', {
    id_municipio: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    id_estado: { type: DataTypes.INTEGER },
  }, {
    tableName: 'municipio',
    timestamps: false,
  });

  municipio.associate = (models) => {
    municipio.belongsTo(models.estado, { foreignKey: 'id_estado' });
  };

  return municipio;
};
