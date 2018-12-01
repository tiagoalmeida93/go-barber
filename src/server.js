const express = require('express')
const session = require('express-session')
const LokiStore = require('connect-loki')(session)
const nunjucks = require('nunjucks')
const path = require('path')
const flash = require('connect-flash')

/**
 * A lib session-file-stote Guarda a sessão em arquivos json(para aprendizado).
 * Para uso prof é recomendado o uso da const FileStore = require('session-file-store')(session)
 *
 * @description: Cria a classe App responsável por receber todas as configurações do servidor nodejs
 */
class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.middlewares()
    this.views()
    this.routes()
  }

  middlewares () {
    this.express.use(express.urlencoded({ extended: false })) // Para receber dados do formulário
    this.express.use(flash()) // Menssages flash
    this.express.use(
      session({
        name: 'root',
        secret: 'MyAppSecret',
        resave: true,
        store: new LokiStore({
          path: path.resolve(
            __dirname,
            '..',
            'tmp',
            'sessions',
            'session.store.db'
          ),
          logErrors: true
        }),
        saveUninitialized: true
      })
    ) // Salva a sessão em arquivo json
  }

  /**
   * @description: Informa o nunjucks qual o caminhos da views
   *  Foi utilizado o path para configurar o caminhos das pastas em ./src/app/views
   */
  views () {
    nunjucks.configure(path.resolve(__dirname, 'app', 'views'), {
      watch: this.isDev,
      express: this.express,
      autoescape: true
    })

    // Configura o express para servir os arquivos da pasta public sem a necessidade de estarem em alguma rota
    this.express.use(express.static(path.resolve(__dirname, 'public')))
    this.express.set('view engine', 'njk') // Seta a view engine para njk
  }
  routes () {
    this.express.use(require('./routes.js'))
  }
}

// Exporta o express da classe App
module.exports = new App().express
