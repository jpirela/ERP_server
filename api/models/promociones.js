// server/api/models/promociones.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const promociones = sequelize.define('promociones', {
    id_promocion: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT },
    descuento_porcentaje: { type: DataTypes.DECIMAL },
    fecha_inicio: { type: DataTypes.DATEONLY },
    fecha_fin: { type: DataTypes.DATEONLY },
  }, {
    tableName: 'promociones',
    timestamps: false,
  });

  promociones.associate = (models) => {

  };

  return promociones;
};
