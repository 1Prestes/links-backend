const { getMessage } = require('./messages');

const getValidatorError = (error, messagePath) => {
  if (!error) return null;

  const errorMessages = {};

  error.details.map((detail) => {
    const { message } = detail;
    const { type } = detail;
    const { key } = detail.context;
    const path = `${messagePath}.${key}.${type}`;

    const customMessage = getMessage(path);
    if (!customMessage) {
      console.log('Custom message not found for path:', path);
    }
    errorMessages[key] = customMessage || message;
  });

  return errorMessages;
};

module.exports = { getValidatorError, getMessage };
