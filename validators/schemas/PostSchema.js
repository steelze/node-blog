const { checkSchema } = require('express-validator');

module.exports = checkSchema({
  title: {
    trim: true,
    escape: true,
    notEmpty: true,
  },
  body: {
    trim: true,
    escape: true,
    notEmpty: true,
  },
}, ['body']);
