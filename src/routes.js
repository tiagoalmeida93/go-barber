const express = require('express')
const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)

// Import as Controllers
const userController = require('./app/controllers/UserController')
const SessionContrller = require('./app/controllers/SessionController')
const DashboardController = require('./app/controllers/DashboardController')
const FileController = require('./app/controllers/FileController')
const AppointmenteController = require('./app/controllers/AppointmentController')
const AvailableController = require('./app/controllers/AvailableController')

// Importa os middlewares
const authMiddleware = require('./app/middlewares/auth')
const guesMiddleware = require('./app/middlewares/guest')

// Inicia o express para tratar as rotas
const routes = express.Router()

// Middleware que passa as menssages do connect-flash para as views
routes.use((req, res, next) => {
  res.locals.flashError = req.flash('error')
  res.locals.flashSuccess = req.flash('success')

  return next()
})

// Rota para servir as images dos usuários
routes.get('/file/:file', FileController.show)

// User routes
routes.get('/signup', guesMiddleware, userController.create)
routes.post('/signup', upload.single('avatar'), userController.store)

/**
 *  app (área logada)
 * Carrega o middleware em todas as rotas seguidas de /app.
 */

// Autenticação
routes.get('/', guesMiddleware, SessionContrller.create)
routes.post('/signin', SessionContrller.store)
routes.get('/app/logout', SessionContrller.destroy)
routes.use('/app', authMiddleware)
routes.get('/app/dashboard', DashboardController.index)

// Appointments
routes.get('/app/appointments/new/:provider', AppointmenteController.create)
routes.get('/app/available/:provider', AvailableController.index)
routes.post('/app/appointments/new/:provider', AppointmenteController.store)

module.exports = routes
