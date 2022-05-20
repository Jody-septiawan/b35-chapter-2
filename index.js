const express = require('express');

const app = express();
const PORT = 80;

const isLogin = true;

app.set('view engine', 'hbs'); //setup template engine / view engine

app.use('/public', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/blog', (req, res) => {
  res.render('blog', { isLogin: isLogin });
});

app.get('/add-blog', (req, res) => {
  res.render('form-blog');
});

app.post('/add-blog', (req, res) => {
  const data = req.body;
  console.log(data);

  res.redirect('/contact');
});

app.get('/detail-blog/:index', (req, res) => {
  const index = req.params.index;

  res.render('blog-detail', { data: index, number: '2022' });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// Backend = 5000 etc
// Frontend = 3000 etc
