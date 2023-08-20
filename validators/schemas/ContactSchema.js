const { checkSchema } = require('express-validator');

module.exports = checkSchema({
  name: {
    trim: true,
    escape: true,
    notEmpty: true,
  },
  email: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: 'Email address is required',
    },
    isEmail: {
      errorMessage: 'Email address must be a valid email address',
    },
  },
  message: {
    trim: true,
    escape: true,
    notEmpty: true,
  },
}, ['body']);
