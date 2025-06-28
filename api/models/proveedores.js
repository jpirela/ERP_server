// server/api/models/proveedores.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const proveedores = sequelize.define('proveedores', {
    id_proveedor: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    contacto: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    correo: { type: DataTypes.STRING },
    direccion: { type: DataTypes.TEXT },
    fecha_registro: { type: DataTypes.DATE },
  }, {
    tableName: 'proveedores',
    timestamps: false,
  });

  proveedores.associate = (models) => {

  };

  return proveedores;
};
