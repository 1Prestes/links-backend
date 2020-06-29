const express = require('express');

const authController = require('./constrollers/auth');

const app = express();

app.get('/', (req, res) => {
    res.json('Oi');
});

app.use('/auth', authController);

app.listen(3001, () => {
    console.log('SERVER RUNNING!');
});
