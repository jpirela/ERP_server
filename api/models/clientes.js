// server/api/models/clientes.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const clientes = sequelize.define('clientes', {
    id_cliente: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    razon_social: { type: DataTypes.STRING },
    rif: { type: DataTypes.STRING },
    correo: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    direccion: { type: DataTypes.TEXT },
    ubicacion_map: { type: DataTypes.TEXT },
    local: { type: DataTypes.STRING },
    punto_referencia: { type: DataTypes.TEXT },
    fecha_registro: { type: DataTypes.DATE },
    id_estado: { type: DataTypes.INTEGER },
    id_municipio: { type: DataTypes.INTEGER },
    id_parroquia: { type: DataTypes.INTEGER },
    id_ciudad: { type: DataTypes.INTEGER },
    id_forma_pago: { type: DataTypes.INTEGER },
    id_condicion_pago: { type: DataTypes.INTEGER },
    dia_recepcion: { type: DataTypes.STRING },
  }, {
    tableName: 'clientes',
    timestamps: false,
  });

  clientes.associate = (models) => {
    clientes.belongsTo(models.estado, { foreignKey: 'id_estado' });
    clientes.belongsTo(models.municipio, { foreignKey: 'id_municipio' });
    clientes.belongsTo(models.parroquia, { foreignKey: 'id_parroquia' });
    clientes.belongsTo(models.ciudad, { foreignKey: 'id_ciudad' });
    clientes.belongsTo(models.forma_pago, { foreignKey: 'id_forma_pago' });
    clientes.belongsTo(models.condicion_pago, { foreignKey: 'id_condicion_pago' });
  };

  return clientes;
};
