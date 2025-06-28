// server/api/models/ciudad.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ciudad = sequelize.define('ciudad', {
    id_ciudad: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    id_municipio: { type: DataTypes.INTEGER },
  }, {
    tableName: 'ciudad',
    timestamps: false,
  });

  ciudad.associate = (models) => {
    ciudad.belongsTo(models.municipio, { foreignKey: 'id_municipio' });
  };

  return ciudad;
};
