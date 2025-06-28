// server/api/models/contacto.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const contacto = sequelize.define('contacto', {
    id_contacto: { type: DataTypes.INTEGER },
    id_cliente: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    apellido: { type: DataTypes.STRING },
    cargo: { type: DataTypes.STRING },
    telefono1: { type: DataTypes.STRING },
    telefono2: { type: DataTypes.STRING },
  }, {
    tableName: 'contacto',
    timestamps: false,
  });

  contacto.associate = (models) => {
    contacto.belongsTo(models.clientes, { foreignKey: 'id_cliente' });
  };

  return contacto;
};
