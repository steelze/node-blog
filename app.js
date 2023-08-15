const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// Use Helmet!
app.use(helmet());

app.set('view engine', 'ejs');
app.use(morgan('dev'))
app.use(express.static('assets'))

const postsDataStorePath = './database/posts.json';

app.get('/', (req, res) => {
  fs.readFile(postsDataStorePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ 'error': 'An error occured', 'data': err });
    }

    const posts = JSON.parse(data);
    const sortedPosts = posts.sort((a, b) => b.read_count - a.read_count);
    const popularPosts = sortedPosts.slice(0, 3);
    return res.status(200).render('home', { posts, popularPosts });
  });
});

app.get('/about', (req, res) => {
  return res.status(200).render('./about');
});

app.get('/contact', (req, res) => {
  return res.status(200).render('./contact');
});

app.get('/categories/:category', (req, res) => {
  fs.readFile(postsDataStorePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ 'error': 'An error occured', 'data': err });
    }
    const { category } = req.params;
    const posts = JSON.parse(data);
    const categoryPosts = posts.filter((post) => post.category.toLowerCase() == category.toLowerCase());
    const sortedPosts = posts.sort((a, b) => b.read_count - a.read_count);
    const popularPosts = sortedPosts.slice(0, 3);
    return res.status(200).render('./category-posts', { posts: categoryPosts, popularPosts, category });
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
