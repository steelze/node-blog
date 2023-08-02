const express = require('express');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    return res.status(200).render('home');
    res.json({ greeting: 'Hello World' });
});

app.use((req, res) => {
    return res.status(200).render('./errors/404');

    res.status(404).json({ error: 'Page Not Found' });
});

const PORT = 3000;

app.listen(3000, () => {
    console.log(`Listening on PORT - ${PORT}`);
})