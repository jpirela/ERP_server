// auth/models/UserLog.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const users_log = sequelize.define('users_log', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: { type: DataTypes.INTEGER },
    loginAt: { type: DataTypes.DATE },
    logoutAt: { type: DataTypes.DATE },
    ip: { type: DataTypes.STRING, required: true },
    hostname: { type: DataTypes.STRING, required: true },
    userAgent: { type: DataTypes.STRING },
    browser: { type: DataTypes.STRING },
    browserVersion: { type: DataTypes.STRING },
    operatingSystem: { type: DataTypes.STRING },
  }, {
    tableName: 'usuarios_log',
    timestamps: false,
  });

  return users_log;
};