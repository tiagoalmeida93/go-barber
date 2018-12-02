/**
 * @description: Cria uma model 'Appointment' com um campo do tipo data
 * Associa essa model a model User, para adicinaor as referências como foreignKey no banco
 */
module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    data: DataTypes.DATE
  })

  Appointment.associate = models => {
    Appointment.belongsTo(models.User, { foreignKey: 'user_id' })
    Appointment.belongsTo(models.User, { foreignKey: 'provider_id' })
  }

  return Appointment
}
