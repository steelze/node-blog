const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session')
const flash = require('connect-flash');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const ArrayPaginator = require('./utils/ArrayPaginator');
const ContactSchema = require('./validators/schemas/ContactSchema');
const RegisterSchema = require('./validators/schemas/RegisterSchema');
const User = require('./Model/User');

const app = express();

// Use Helmet!
app.use(helmet());

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.static('assets'));

app.use(session({
  secret: 'yoursecret',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.validation_errors = req.flash('validation_errors');
  res.locals.old_validation_data = req.flash('old_validation_data');
  next();
});

const dataStorePath = './database';
const postsDataStorePath = './database/posts.json';
const usersDataStorePath = './database/users.json';

if (!fs.existsSync(`${dataStorePath}/contact.json`)) {
  fs.writeFileSync(`${dataStorePath}/contact.json`, JSON.stringify([]));
}

if (!fs.existsSync(usersDataStorePath)) {
  fs.writeFileSync(usersDataStorePath, JSON.stringify([]));
}

app.get('/', (req, res) => {
  fs.readFile(postsDataStorePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ 'error': 'An error occured', 'data': err });
    }

    let posts = JSON.parse(data);
    const pageNumber = parseInt(req.query.page || 1);
    const q = (req.query.q || '').trim();
    const limit = 6;

    if (q) {
      posts = posts.filter((post) => post.title.includes(q));
    }

    const { content, meta } = ArrayPaginator.createPaginatedDataFromArray(req, posts, pageNumber, limit);

    const sortedPosts = posts.sort((a, b) => b.read_count - a.read_count);
    const popularPosts = sortedPosts.slice(0, 3);
    return res.status(200).render('home', { posts: content, popularPosts, meta, q });
  });
});

app.get('/about', (req, res) => {
  return res.status(200).render('./about');
});

app.get('/contact', (req, res) => {
  return res.status(200).render('./contact');
});

app.post('/contact', ContactSchema, (req, res) => {
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
    return res.redirect('/contact');
  }

  fs.readFile(`${dataStorePath}/contact.json`, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ 'error': 'An error occured', 'data': err });
    }
    let submissions = JSON.parse(data);
    submissions.push({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    })
    fs.writeFile(`${dataStorePath}/contact.json`, JSON.stringify(submissions), (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ 'error': 'An error occured', 'data': err });
      }
      req.flash('success', 'Contact form submitted successfully');
      return res.redirect('/contact');
    });
  });
});

app.get('/login', (req, res) => {
  return res.status(200).render('./auth/login');
});

app.get('/register', (req, res) => {
  return res.status(200).render('./auth/register');
});

app.post('/register', RegisterSchema, (req, res) => {
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
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });

    req.flash('success', 'Account created successfully');
    return res.redirect('/login');
  });
});


app.get('/categories/:category', (req, res) => {
  fs.readFile(postsDataStorePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ 'error': 'An error occured', 'data': err });
    }
    const { category } = req.params;
    const posts = JSON.parse(data);
    const pageNumber = parseInt(req.query.page || 1);
    const limit = 6;

    const categoryPosts = posts.filter((post) => post.category.toLowerCase() == category.toLowerCase());
    const { content, meta } = ArrayPaginator.createPaginatedDataFromArray(req, categoryPosts, pageNumber, limit);

    const sortedPosts = posts.sort((a, b) => b.read_count - a.read_count);
    const popularPosts = sortedPosts.slice(0, 3);
    return res.status(200).render('./category-posts', { posts: content, popularPosts, category, meta });
  });
});

app.get('/:slug', (req, res, next) => {
  const { slug } = req.params;
  fs.readFile(postsDataStorePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ 'error': 'An error occured', 'data': err });
    }

    const posts = JSON.parse(data);
    const post = posts.find(post => post.slug === slug);
    if (post) {
      res.status(200).render('./post-detail', { post, popularPosts: [] })
    }
    next();
  });
});

app.use((req, res) => {
  return res.status(404).render('./errors/404');
});

const PORT = 3000;

app.listen(3000, () => {
  console.log(`Listening on PORT - ${PORT}`);
})
