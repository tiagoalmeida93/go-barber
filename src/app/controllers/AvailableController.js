const moment = require('moment')
const { Op } = require('sequelize')
const { Appointment } = require('../models')

class AvailableController {
  async index (req, res) {
    // pega o timestamp da data e transforma em inteiro
    const date = moment(parseInt(req.query.date))

    /**
     * A query filtra todos os agendamentos no id do usuário passado, onde traz das 00:00 até 23:59(dia inteiro)
     */
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.provider,
        data: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    const schedule = [
      '00:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00'
    ]

    const available = schedule.map(time => {
      // Separa hora e minuto
      const [hour, minute] = time.split(':')

      // Monta uma data no formato '2018-10-12 08:88' com os dados recebidos do formulário
      const value = date
        .hour(hour)
        .minute(minute)
        .second(0)

      /**
       * Valdia se a data e hora informada pelo usuário já está preenchida por outra pessoa ou ja passou do horário atual
       * dessa forma, retorna o available como true ou false dependendo da condição
       */
      return {
        time,
        value: value.format(),
        available:
          value.isAfter(moment()) &&
          !appointments.find(a => moment(a.data).format('HH:mm') === time)
      }
    })

    return res.render('available/index', { available })
  }
}

module.exports = new AvailableController()
