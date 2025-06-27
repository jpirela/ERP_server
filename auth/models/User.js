// server/api/models/User.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const users = sequelize.define('users', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: { type: DataTypes.STRING },
    correo: { type: DataTypes.STRING },
    contraseña: { type: DataTypes.STRING },
    rol: { type: DataTypes.ENUM('admin', 'vendedor', 'almacen') },
    fecha_registro: { type: DataTypes.DATE },
  }, {
    tableName: 'usuarios',
    timestamps: false,
  });

  return users;
};
