/**
 * @description: O arquivo database.js é responsável por exportar as configurações de acesso ao banco de dados
 * Para a utilização do postgres é necessário a instalação de sua dependência `yarn add pg`.
 * No caso da utilização de outros dbs como mysql, sql etc consultar a documentação do sequelize
 * Para mais, consultar a documentação do sequelize
 */

module.exports = {
  dialect: 'postgres',
  host: '127.0.0.1',
  username: 'docker',
  password: 'docker',
  database: 'gonodemod2',
  operatorAliases: false,
  define: {
    timestamps: true, // Adiciona as colunas createdAt e updatedAt em nossas bases de dados
    underscored: true, // Permite o sequelize utilizar o snake_case e/ou camel_case nas colunas do DB
    underscoredAll: true // Permite o sequelize utilizar o snake_case e/ou camel_case nas tabelas do DB
  }
}
