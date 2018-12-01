/**
 * @description: Verifica se o usuário não se encontra logado(sessão).
 * Caso esteja logado, redireciona para o dashboar.
 */
module.exports = (req, res, next) => {
  if (req.session && !req.session.user) {
    return next()
  }

  return res.redirect('/app/dashboard')
}
