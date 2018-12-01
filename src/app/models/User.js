const bcrypt = require('bcryptjs')

/**
 * @description: Os parametros sequelize e DataTypes são passados pelo arquivo ./index.js(que carrega todas as models);
 * Sequelize: Instancia do object, conexeção com o DB
 * DataTypes: Tabelas que podemos utilizar no DB
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      avatar: DataTypes.STRING,
      password: DataTypes.VIRTUAL, // DataTypes.VIRTUAL são campos que existem em nosso app, mas não no banco
      password_hash: DataTypes.STRING,
      provider: DataTypes.BOOLEAN
    },
    {
      // Hooks são automatizações que acontecem antes dos dados serem salvos no banco pela Model (http://docs.sequelizejs.com/manual/tutorial/hooks.html)
      hooks: {
        beforeSave: async user => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8)
          }
        }
      }
    }
  )

  // Função adicionada para checar o password na tentativa de login
  User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password_hash)
  }

  return User
}
