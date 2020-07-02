const messages = require('../config/messages.json');

const getMessage = (path) => messages[path] || null;

module.exports = { getMessage };
