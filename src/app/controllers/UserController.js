const { User } = require('../models')

class UserController {
  // Retorna a view para criaçaõ de usuário
  create (req, res) {
    return res.render('_auth/signup')
  }

  // Cria um novo usuário na base de dados
  async store (req, res) {
    try {
      const { filename } = req.file
      await User.create({ ...req.body, avatar: filename })

      return res.redirect('/')
    } catch (err) {
      return res.send(err)
    }
  }
}

module.exports = new UserController()
