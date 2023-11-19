const express = require('express');
const PostSchema = require('../validators/schemas/PostSchema');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get('/index', (req, res) => {
  return res.status(200).render('./user/post-index');
});

router.get('/create', (req, res) => {
  return res.status(200).render('./user/post-create');
});

router.post('/store', PostSchema, (req, res) => {
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
    return res.redirect('/posts/create');
  }

  // TODO: Save to database
  req.flash('success', 'Post form submitted successfully');
  return res.redirect('/posts/create');
});

router.get('/pending', (req, res) => {
  return res.status(200).render('./admin/post-pending');
});

router.get('/approved', (req, res) => {
  return res.status(200).render('./admin/post-approved');
});

module.exports = router
