'use strict'

/**
 * @description: Cria a tabela appointments e configura as chaves estrangeniras
 * user_id e provider_id, ambas vindo da tablea users
 */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      data: {
        allowNull: false,
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }, // referencia a tabela e o campo que vai compor a chave estrangeria
        onUpdate: 'CASCADE', // Caso o usuário sofla qualquer update, a alteração também e refletida na tabela appointments
        onDelete: 'CASCADE', // Se o usuário for apagado, a alteração também e refletida na tabela appointments
        allowNull: false
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('appointments')
  }
}
