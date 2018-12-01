/**
 * @description: Verifica se existe uma session, e se existe uma session.user(usuário autenticado) para prosseguir
 * com o acesso as rotas restritas.
 * Caso a session não exita, redireciona para o login.
 */
module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    /**
     * O req.locals.user fica disponível para todas as views do njks.
     * Ela foi carrega com as informações de sessão do usuário.
     */

    res.locals.user = req.session.user
    return next()
  }

  return res.redirect('/')
}
