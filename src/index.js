const express = require('express');
const cors = require('cors');
const db = require('./models');
const response = require('./middlewares/response');
const checkJwt = require('./middlewares/jwt');

const authController = require('./constrollers/auth');
const linkController = require('./constrollers/link');

const app = express();

app.use(cors());
app.use(response);
app.use(checkJwt);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json('App Running');
});

app.use('/auth', authController);
app.use('/link', linkController);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('SERVER RUNNING!');
  });
});
