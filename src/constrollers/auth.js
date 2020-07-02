const express = require('express');
const bcrypt = require('bcrypt');
const { Account } = require('../models');
const { accountSignUp, accountSignIn } = require('../validators/account');
const { getMessage } = require('../helpers/validator');
const { generatJwt, generatRefreshJwt, verifyRefreshJwt, getTokenFromHeaders } = require('../helpers/jwt');
const { verify, decode } = require('jsonwebtoken');

const router = express.Router();

router.post('/sign-in', accountSignIn, async (req, res) => {
    const { email, password } = req.body;
    const account = await Account.findOne({ where: { email } });

    // Valid password
    const match = account ? bcrypt.compareSync(password, account.password) : null;

    if (!match) return res.jsonBadRequest(null, getMessage('account.signin.invalid'));

    const token = generatJwt({ id: account.id });
    const refreshToken = generatRefreshJwt({ id: account.id, version: account.jwtVersion });

    return res.jsonOK(account, null, { token, refreshToken });
});

router.post('/sign-up', accountSignUp, async (req, res) => {
    const { email, password } = req.body;
    const account = await Account.findOne({ where: { email } });

    if (account) return res.jsonBadRequest(null, getMessage('account.signup.email_exists'));


    const hash = bcrypt.hashSync(password, 10);
    const newAccount = await Account.create({ email, password: hash });

    const token = generatJwt({ id: newAccount.id });
    const refreshToken = generatRefreshJwt({ id: newAccount.id, version: newAccount.jwtVersion });

    return res.jsonOK(newAccount, getMessage('account.signup.success'), { token, refreshToken });
});

router.post('/refresh', async (req, res) => {
    const token = getTokenFromHeaders(req.headers);
    if (!token) return res.jsonUnauthorized(null, 'Invalid token.');

    try {
        const decoded = verifyRefreshJwt(token);
        const account = await Account.findByPk(decoded.id);

        if (!account) return res.jsonUnauthorized(null, 'Invalid token.');

        if (decoded.version !== account.jwtVersion) return res.jsonUnauthorized(null, 'Invalid token.');

        const meta = {
            token: generatJwt({ id: account.id }),
        }

        return res.jsonOK(null, null, meta);
    } catch (e) {

        return res.jsonUnauthorized(null, 'Invalid token.');
    }
});

module.exports = router;
