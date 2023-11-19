const express = require('express');
var passport = require('passport');
const bcrypt = require('bcrypt');

const { body, validationResult } = require('express-validator');
var LocalStrategy = require('passport-local');


const RegisterSchema = require('../validators/schemas/RegisterSchema');
const LoginSchema = require('../validators/schemas/LoginSchema');
const User = require('../Model/User');


const router = express.Router();

const saltRounds = 10;

passport.serializeUser(function(user, cb) {
  cb(null, user.email);
});

passport.deserializeUser(async function(email, cb) {
  const user = await new User().findByEmail(email);
  return cb(null, user);
});


const isGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile")
   }
  next()
}

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async function (username, password, cb) {
  console.log(3239);
  console.log(username, password);
  const user = await new User().findByEmail(username);
  if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

  const result = await bcrypt.compare(password, user.password);

  if (result) {
    return cb(null, user);
  } else {
    return cb(null, false, { message: 'Incorrect username or password.' });
  }
}));


router.get('/login', isGuest, (req, res) => {
  return res.status(200).render('./auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/auth/login',
  failureFlash: true,
}));

router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("/");
  });
});

router.get('/register', (req, res) => {
  return res.status(200).render('./auth/register');
});

router.post('/register', RegisterSchema, (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const groupedErrors = {};

    for (const error of result.array()) {
      if (!groupedErrors[error.path]) {
        groupedErrors[error.path] = [];
      }
      groupedErrors[error.path].push(error);
    }

    req.flash('validation_errors', groupedErrors);
    req.flash('old_validation_data', req.body);
    return res.redirect('/register');
  }


  bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
    if (err) {
      console.log(err);
      return res.status(500).json({ 'error': 'An error occured', 'data': err });
    }

    const model = new User();
    const user = await model.create({
      id: Date.now(),
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });

    req.flash('success', 'Account created successfully');
    return res.redirect('/auth/login');
  });
});

module.exports = router
