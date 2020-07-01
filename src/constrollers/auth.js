const express = require('express');
const bcrypt = require('bcrypt');
const { Account } = require('../models');
const { accountSignUp, accountSignIn } = require('../validators/account');
const { getMessage } = require('../helpers/validator');
const { generatJwt, generatRefreshJwt } = require('../helpers/jwt');

const router = express.Router();

router.post('/sign-in', accountSignIn, async (req, res) => {
    const { email, password } = req.body;
    const account = await Account.findOne({ where: { email } });

    // Valid password
    const match = account ? bcrypt.compareSync(password, account.password) : null;

    if (!match) return res.jsonBadRequest(null, getMessage('account.signin.invalid'));

    const token = generatJwt({ id: account.id });
    const refreshToken = generatRefreshJwt({ id: account.id });

    return res.jsonOK(account, null, { token, refreshToken });
});

router.post('/sign-up', accountSignUp, async (req, res) => {
    const { email, password } = req.body;
    const account = await Account.findOne({ where: { email } });

    if (account) return res.jsonBadRequest(null, getMessage('account.signup.email_exists'));


    const hash = bcrypt.hashSync(password, 10);
    const newAccount = await Account.create({ email, password: hash });

    const token = generatJwt({ id: newAccount.id });
    const refreshToken = generatRefreshJwt({ id: newAccount.id });

    return res.jsonOK(newAccount, getMessage('account.signup.success'), { token, refreshToken });
});

module.exports = router;
