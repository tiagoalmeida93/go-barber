const { User } = require('../models')

class SessionController {
  // Retorna a view de autenticação
  async create (req, res) {
    return res.render('_auth/signin')
  }

  // Autentica o usuário na aplicação
  async store (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      console.log('error', 'Usuário não encontrado')
      req.flash('error', 'Usuário não encontrado')
      return res.redirect('/')
    }

    if (!(await user.checkPassword(password))) {
      console.log('error', 'Senha incorreta')
      req.flash('error', 'Senha incorreta')
      return res.redirect('/')
    }

    req.session.user = user

    return res.redirect('/app/dashboard')
  }

  // Destroi a sessão encerrando o login
  destroy (req, res) {
    req.session.destroy(() => {
      res.clearCookie('root')
      return res.redirect('/')
    })
  }
}

module.exports = new SessionController()
