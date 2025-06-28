// server/api/models/distribuidor.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const distribuidor = sequelize.define('distribuidor', {
    id_distribuidor: { type: DataTypes.INTEGER },
    id_proveedor: { type: DataTypes.INTEGER },
    nombre_contacto: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    correo: { type: DataTypes.STRING },
    zona_distribucion: { type: DataTypes.STRING },
  }, {
    tableName: 'distribuidor',
    timestamps: false,
  });

  distribuidor.associate = (models) => {
    distribuidor.belongsTo(models.proveedores, { foreignKey: 'id_proveedor' });
  };

  return distribuidor;
};
