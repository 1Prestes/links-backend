const express = require('express');
const db = require('./models');
const response = require('./middlewares/response');

const authController = require('./constrollers/auth');

const app = express();

app.use(response);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.json('Oi');
});

app.use('/auth', authController);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('SERVER RUNNING!');
    });
});
