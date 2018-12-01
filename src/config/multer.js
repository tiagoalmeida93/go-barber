const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
module.exports = {
  storage: multer.diskStorage({
    // Aponta a pasta para salvar os arquivos no disklocal
    destination: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // Rece uma função que concatena uma string aleatória de 16bytes no nome do arquivo para nao haver conflitos
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, raw) => {
        // Verifica se houve erro ao gerar a string e retorna o erro caso verdadeiro
        if (err) return cb(err)

        // Se não, contatena a string convertida em hexadecimal no nome orginal do arquivo
        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
  })
}
