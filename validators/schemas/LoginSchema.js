const { checkSchema } = require('express-validator');
const User = require('../../Model/User');

module.exports = checkSchema({
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
  password: {
    notEmpty: true,
  },
}, ['body']);
