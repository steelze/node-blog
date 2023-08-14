const express = require('express');
const morgan = require('morgan')

const app = express();

app.set('view engine', 'ejs');
app.use(morgan('dev'))
app.use(express.static('assets'))

const posts = [
  {
    id: 1,
    title: "Exploring Ancient Ruins",
    slug: "exploring-ancient-ruins",
    cover_image: `/img/articles/1.jpg`,
    snippet: "Uncover the mysteries of ancient civilizations as we journey through breathtaking ruins across the globe."
  },
  {
    id: 2,
    title: "Culinary Adventures",
    slug: "culinary-adventures",
    cover_image: `/img/articles/2.jpg`,
    snippet: "Embark on a gastronomic journey as we explore diverse cuisines and savor the flavors that define cultures worldwide."
  },
  {
    id: 3,
    title: "Innovation in Tech",
    slug: "innovation-in-tech",
    cover_image: `/img/articles/3.jpg`,
    snippet: "Stay updated on the latest technological breakthroughs and innovations shaping the future of our digital world."
  },
  {
    id: 4,
    title: "The Art of Photography",
    slug: "the-art-of-photography",
    cover_image: `/img/articles/4.jpg`,
    snippet: "Capture moments that last a lifetime by delving into the world of photography techniques and artistic expression."
  },
  {
    id: 5,
    title: "Exploring Deep Oceans",
    slug: "exploring-deep-oceans",
    cover_image: `/img/articles/5.jpg`,
    snippet: "Plunge into the depths of the ocean to discover its hidden wonders and the fascinating creatures that call it home."
  },
  {
    id: 7,
    title: "The World of Literature",
    slug: "the-world-of-literature",
    cover_image: `/img/articles/7.jpg`,
    snippet: "Dive into the rich realm of literature, where words become a gateway to different worlds, cultures, and perspectives."
  },
  {
    id: 8,
    title: "Artistry in Motion",
    slug: "artistry-in-motion",
    cover_image: `/img/articles/8.jpg`,
    snippet: "Witness the magic of dance, theater, and performance art, where human creativity comes to life through movement and expression."
  },
  {
    id: 9,
    title: "Exploring Natural Wonders",
    slug: "exploring-natural-wonders",
    cover_image: `/img/articles/9.jpg`,
    snippet: "Discover the awe-inspiring beauty of natural landscapes, from majestic mountains to serene forests, and everything in between."
  },
  {
    id: 10,
    title: "Mysteries of History",
    slug: "mysteries-of-history",
    cover_image: `/img/articles/10.jpg`,
    snippet: "Unearth the secrets of bygone eras, as we delve into historical events, figures, and artifacts that have shaped our world."
  },
  {
    id: 11,
    title: "Culinary Delights",
    slug: "culinary-delights",
    cover_image: `/img/articles/11.jpg`,
    snippet: "Embark on a culinary journey to savor delectable dishes and explore the cultural significance of food from around the globe."
  },
  {
    id: 12,
    title: "Adventures in Travel",
    slug: "adventures-in-travel",
    cover_image: `/img/articles/12.jpg`,
    snippet: "Pack your bags and join us on thrilling travel adventures as we explore new destinations and immerse ourselves in diverse cultures."
  },
  {
    id: 13,
    title: "Music: The Universal Language",
    slug: "music-the-universal-language",
    cover_image: `/img/articles/13.jpg`,
    snippet: "Dive into the world of melodies, rhythms, and harmonies as we explore the transformative power of music across different genres and cultures."
  },
  {
    id: 18,
    title: "Exploring Urban Landscapes",
    slug: "exploring-urban-landscapes",
    cover_image: `/img/articles/18.jpg`,
    snippet: "Take a stroll through bustling city streets as we delve into the architecture, culture, and stories that shape urban environments."
  },
  {
    id: 19,
    title: "Marvels of Modern Architecture",
    slug: "marvels-of-modern-architecture",
    cover_image: `/img/articles/19.jpg`,
    snippet: "Discover the innovative designs and breathtaking structures that define the modern architectural landscape around the world."
  },
  {
    id: 20,
    title: "Art and Expression",
    slug: "art-and-expression",
    cover_image: `/img/articles/20.jpg`,
    snippet: "Immerse yourself in the diverse world of artistic expression, from classical masterpieces to contemporary creations that challenge the norm."
  },
  {
    id: 21,
    title: "Nature's Wonders",
    slug: "natures-wonders",
    cover_image: `/img/articles/21.jpg`,
    snippet: "Immerse yourself in the beauty of nature's most stunning landscapes and awe-inspiring phenomena."
  }
];

app.get('/', (req, res) => {
  return res.status(200).render('home', { posts });
});

app.get('/about', (req, res) => {
  return res.status(200).render('./about');
});

app.get('/contact', (req, res) => {
  return res.status(200).render('./contact');
});

app.get('/categories/:category', (req, res) => {
  return res.status(200).render('category-posts', { posts });
});

app.get('/:slug', (req, res) => {
  const post = {
    id: 1,
    title: "Exploring Ancient Ruins",
    slug: "exploring-ancient-ruins",
    cover_image: `/img/articles/1.jpg`,
    snippet: "Uncover the mysteries of ancient civilizations as we journey through breathtaking ruins across the globe."
  };

  return res.status(200).render('./post-detail', { post });
});

app.use((req, res) => {
  return res.status(200).render('./errors/404');

  res.status(404).json({ error: 'Page Not Found' });
});

const PORT = 3000;

app.listen(3000, () => {
  console.log(`Listening on PORT - ${PORT}`);
})
