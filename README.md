# App GoBarber

O aplicativo tem como objetivo utilizar as melhores práticas do nodejs + MVC + PostgreSQL.

<br>

### Configurando o Ambiente

Para configuração do ambiente de desenvolvimento, foi utilizado o eslint + editorconfig. <br>
Na raiz do projeto, foi criado o arquivo .editorconfig com as seguintes configurações:

```javascript
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

<br>

Para configurar o eslint:

1. Instale o eslint `yarn add eslint`
2. Após a instalção, utilize o comando `npx eslint --init`
3. Selecione as opçoes `Use a popular styleguide`, `standard`, `JSON`

<br>

### Configurando o Servidor

Na pasta src, no arquivo server.js, foi criada a classe `App`, responsável por receber todas as configurações necessárias do nosso servidor. <br>
Para mais informaçẽos, consulte a documentação presente no arquivo .src/server.js

<br>

### Configurando o Sequelize

O sequelize é um ORM, uma lib para utilizarmos JS para manipular o SQL em vez de sua linguagem nativa. <br>
Dito isso, nós instalamos o sequelize `yarn add sequelize` e seu CLI `yarn add sequelize -D`. <br>
Utilizando o termianl digite `npx sequelize init`. <br>
Foram criados alguns arquivos na raiz do projeto. Para melhorar a estrutura do projeto, os arquivos foram realocados da seguinte maneira:

1. A pasta Models foi colocada em ./src/app;
2. Foi criada a pasta database em ./src e movida as pastas migrations e seeders para dentro dela;
3. A pasta config foi colocada em ./src;
4. Na raiz do projeto foi adicionado o arquvio .sequelizerc, responsável por configurar a nova estrura de pastas referente aos arquivos criados pelo `sequelize-cli`, sua configuração é:

```javascript
const path = require('path')

module.exports = {
  config = path.resolve('src', 'config', 'database.js'),
  'models-path': path.resolve('src', 'app', 'models'),
  'seeders-path': path.resolve('src', 'database', 'seeders'),
  'migrations-path': path.resolve('src', 'database', 'migrations')
}
```

A fim de teste foi criado uma migration `npx sequelize migration:create --name=create-users`. <br>
Se todas as configurações etiverem corretas, deverá aparecer um arquivo na pasta ./src/database/migrations/arquivo.js. <br>

Agora devemos configurar o arquivo de conexão com o banco de dados(./src/config/database.js) da seguinte forma:

```javascript
module.exports = {
  dialect: "postgres",
  host: "217.0.0.1",
  username: "",
  password: "",
  database: "",
  operatorAliases: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
```

Para mais informações consultar a documentação presente no arquivo.<br>

Feito isso, também é necessário algumas modificações no arquivo ./src/app/models/index.js. <br>
Como o arquivo deve ficar depois de modificado:

```javascript
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const config = require("../../config/database");
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

### Configurando as views

Em app\views foi criada as pastas \_auth, \_layouts, \_partials. <br>
O nunjucks segue o conceito de partials, onde podemos reaproveitar partes de um mesmo html dependendo da rota acessada. <br>
Tendo isso em mente, sabemos que tudo que estiver em \_layouts deve possuir uma estrtura html, mudando apenas o seu conteúdo dinamicamente. <br>
Em \_partials temos o head da aplicação, devendo ser importado em \_layouts\auth através da tag `{% include "_partials/head.njk" %}`. <br>
Em \layouts\auth.njk, para que o body receba o conteúdo dinamicamente, deve ser inserido no body do arquivo a tag `{% block body %}{% endblock %}`. Onde todo o conteúdo dos arquivos importados estarão dentro de:

```
{% extends "_layouts/auth.njk" %}
{% block body %}
  CONTEÚDO
{% endblock %}
```

Dessa maneira podemos alterar o conteúdo das páginas dinamicamente, reaproveitando o body, header, footer etc.
<br>
<br>
Obs. Para facilitar o import de arquivos css, js etc em nossa aplicação, o mais idela é servir uma pasta pública contendo esse arquivos no servidor. <br>
Para isso, no arquivo `server.js` no método viwes, foi adicionado a seguinte configuração ao express `this.express.use(express.static(path.resolve(__dirname, 'public')))`. Assim, o express fornece todos os arquivos em public sem a necessidade de configurar uma rota para cada arquivo.

### Migrations e Models

A migration serve para versionar nosso banco de dados. <br>
O arquivo index.js em app/models é responsável por carregar todas as nossas models no sistema. Basta criar os arquivos de models na pasta models segundo a sintaxe do sequelize. Exemplo:

```javascript
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    provider: DataTypes.BOOLEAN
  });

  return User;
};
```

Feito isso, configuramos nossa migration em src/database/migrations para criar a tabela usuário com os campos adicionados na model. Também foi configurado os métodos up e down, onde up cria uma tabela e down desfaz a criação da tabela down. <br>
Para rodar a migration, devemos executar o comando `npx sequelize db:migrate` na pasta do arquivo .sequelizerc, que possui as configurações necessárias e apontamentos do sequelize.

### Criando um usuário

Para realizar operações no banco de dados e controlar as regras de negócio, nós utilizamos as controllers.
Após ter a controller User.js criada, basta adicionar o método para criação de usuário:

```javascript
  async store (req, res) {
    req.body.avatar = 'avatar.jpg'
    await User.create(req.body)

    return res.redirect('/')
  }
```

Obs. Para verificar os métodos CRUD, basta consultar a documentação oficial do sequelize. <br>
Para criptografia de senha foi utilizado o bcryptjs, junto do hooks(operação realizada antes da alteração no DB pela model. O hooks é configurado no próprio arquivo da model).

### Upload de arquivos

Para que nosso formulário envie dados para o server, é necessiario adicionar a tag `enctype="multipart/form-data"` no form html.<br>
Também foi instalado o pacote `yarn add multer`, para lidar com nosso uploads. <br>
Feito isso, foi criado um arquivo de configuração do multer em .src/config/multer.js. Esse arquivo foi importando em routes.js, para no routes.js importarmos o multer passando o arquivo de configuração para instância do mesmo.

### Autenticação

Para a autenticação, foi criado uma view em ./\_auth/sigin.njk e uma controller, para termos as rotas devidamentes configuradas no padrão MVC. <br>
O form de autenticação dispara um método post para a rota `/signin`, que verifica o e-email e depois a senha do usuário. <br>
Para a validação do password, foi adicionada uma função na model `User.prototype.checkPassword = function(pass)...`. Dessa maneira temos acesso ao `this`, e assim validamos se o usuário retornado pelo e-mail também possui a senha informada.

### Session

Para trabalharmos com a session foi instalado a lib `yarn add express-session`. <br>
Para utilizarmos a lib no servidor, a mesma deve ser importada no arquivo server.js e passada as seguintes configurações no no méotodo middleware:

```javascript
this.express.use(
  session({
    secret: "MyApp",
    resave: false,
    saveUninitialized: false
  })
);
```

Para lidarmos com o express-sesion, sem a necessidade de guardar a sessão na memória do servidor(problema), é indicado o uso da lib `connect-redis`[lib](https://github.com/tj/connect-redis). <br>
Para fins de aprendizado está sendo utilizada a lib `session-file-store`, que também deve ser importada no server.js passando a session como paramêtro `const fileStore = require('session-file-store')(session)`.<br>
Ao final, o arquivo server.js deve estar configurado com a session e session-file-store da seguinte forma:

```javascript
this.express.use(
  session({
    name: "root",
    secret: "MyAppSecret",
    resave: true,
    store: new FileStore({
      path: path.resolve(__dirname, "..", "tmp", "sessions")
    }),
    saveUninitialized: true
  })
);
```

A lib FileStore, no momento do curso, estava apresentando problemas, por isso foi utilizada a LokiStore da seguinte forma:

```javascript
const LokiStore = require("connect-loki")(session);
this.express.use(
  session({
    name: "root",
    secret: "MyAppSecret",
    resave: true,
    store: new LokiStore({
      path: path.resolve(__dirname, "..", "tmp", "sessions", "session.store.db")
    }),
    saveUninitialized: true
  })
);
```

Obs. Adicionei essa informação a fim de guarda-la em caso de olhar a aula e ver a diferença. <br>

Assim, sempre que um user entrar no app, sera criado um cookie, e quando ele autenticar esse cookie será preenchido com os dados da sessão, que serão enviados no req.session em requisições futuras. <br>

### Falsh messages (erros)

Para exibirmos mgns de erro no sitema, foi instalado a lib `yarn add connect-flash` e usa-lo no express(no método middlewares adicionar o express.use(connect-flash)). <br>
Feito isso, basta adicionar nas respostas das req `req.flash('error/success', 'Senha incorreta')`. <br>
No arquivo de rotas é necessário o seguinte middleware para que as views possam enxergar as menssagens flash:

```javascript
routes.use((req, res, next) => {
  res.locals.flashError = req.flash("error");
  res.locals.flashSuccess = req.flash("success");

  next();
});
```

Para mais detalhes, consultar a documentação do `connect-flash`.<br>
