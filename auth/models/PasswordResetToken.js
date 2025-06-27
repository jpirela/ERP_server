// models/PasswordResetToken.js
export default (sequelize, DataTypes) => {
    const PasswordResetToken = sequelize.define('PasswordResetToken', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'PasswordResetToken',
      timestamps: false,
    });
  
    return PasswordResetToken;
  };
  