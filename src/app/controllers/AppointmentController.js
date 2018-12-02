const { User, Appointment } = require('../models')
const moment = require('moment')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)
    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      data: date
    })
    return res.redirect('/app/dashboard')
  }

  async read (req, res) {
    const { provider } = req.params

    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'user' }],
      where: {
        provider_id: provider
      }
    })

    const list = appointments.map(appointment => {
      return {
        img: appointment.user.avatar,
        name: appointment.user.name,
        day: moment(appointment.data).format('DD/MM/YY'),
        hour: moment(appointment.data).format('HH:mm')
      }
    })

    console.log(list)

    return res.render('appointments/appointments.njk', { list })
  }
}

module.exports = new AppointmentController()
