require('dotenv').config();

const jwt = require('jsonwebtoken');

const tokenPrivateKey = process.env.JWT_TOKEN_PRIVATE_KEY;
const refreshTokenPrivateKey = process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY;
const options = { expiresIn: '50 minutes' };
const refreshOptions = { expiresIn: '1 days' };

const generatJwt = (payload) => jwt.sign(payload, tokenPrivateKey, options);

const generatRefreshJwt = (payload) => jwt.sign(payload, refreshTokenPrivateKey, refreshOptions);

const verifyJwt = (token) => jwt.verify(token, tokenPrivateKey);

const verifyRefreshJwt = (token) => jwt.verify(token, refreshTokenPrivateKey);

const getTokenFromHeaders = (headers) => {
  const token = headers.authorization;
  return token ? token.slice(7, token.length) : null;
};

module.exports = {
  generatJwt, generatRefreshJwt, verifyJwt, verifyRefreshJwt, getTokenFromHeaders,
};
