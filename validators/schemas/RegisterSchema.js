const { checkSchema } = require('express-validator');
const User = require('../../Model/User');

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
    custom: {
      options: async (value) => {
        const model = new User();
        const user = await model.findByEmail(value);

        if (user) {
          return Promise.reject();
        }
      },
      errorMessage: 'Email already exists',
    },
  },
  password: {
    notEmpty: true,
    custom: {
      options: (value, { req }) => value == req.body.password_confirmation,
      errorMessage: 'Password confirmation does not match',
    },
  },
  password_confirmation: {
    notEmpty: true,
  },
}, ['body']);
