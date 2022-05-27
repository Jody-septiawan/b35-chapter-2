const express = require('express');

const db = require('./connection/db');

const app = express();
const PORT = 80;

const isLogin = true;
const blogs = [
  {
    title: 'Test 1',
    content: 'Test 1 COntent',
    time: '23 May 2022 09:25 WIB',
    author: 'Jody Septiawan',
    postedAt: '2022-05-23T02:26:27.403Z',
  },
];

// db.connect(function (err, _, done) {
//   if (err) throw err;

//   console.log('Database Connection Success');
//   done();
// });

app.set('view engine', 'hbs'); //setup template engine / view engine

app.use('/public', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/blog', (req, res) => {
  db.connect(function (err, client, done) {
    if (err) throw err;

    const query = 'SELECT * FROM tb_blog';

    client.query(query, function (err, result) {
      if (err) throw err;

      const blogsData = result.rows;

      const newBlog = blogsData.map((blog) => {
        blog.time = getFullTime(blog.postedAt);
        blog.isLogin = isLogin;
        blog.icon = '<h2>Hello</h2>';
        return blog;
      });

      res.render('blog', { isLogin: isLogin, blogs: newBlog });
    });

    done();
  });
});

app.get('/add-blog', (req, res) => {
  res.render('form-blog');
});

app.post('/add-blog', (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  db.connect(function (err, client, done) {
    if (err) throw err;

    const query = `INSERT INTO tb_blog(title,content) VALUES('${title}','${content}');`;

    client.query(query, function (err, result) {
      if (err) throw err;

      res.redirect('/blog');
    });

    done();
  });
});

app.get('/detail-blog/:id', (req, res) => {
  const id = req.params.id;

  db.connect(function (err, client, done) {
    if (err) throw err;
    const query = `SELECT * FROM tb_blog WHERE id = ${id}`;

    client.query(query, function (err, result) {
      if (err) throw err;

      const blog = result.rows[0];

      blog.time = getFullTime(blog.postedAt);

      console.log(blog);

      res.render('blog-detail', { blog });
    });

    done();
  });
});

app.get('/delete-blog/:id', (req, res) => {
  const id = req.params.id;

  db.connect(function (err, client, done) {
    if (err) throw err;

    const query = `DELETE FROM tb_blog WHERE id = ${id};`;

    client.query(query, function (err, result) {
      if (err) throw err;

      res.redirect('/blog');
    });

    done();
  });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// Backend = 5000 etc
// Frontend = 3000 etc

const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getFullTime(time) {
  time = new Date(time);
  const date = time.getDate();
  const monthIndex = time.getMonth();
  const year = time.getFullYear();
  let hour = time.getHours();
  let minute = time.getMinutes();

  if (hour < 10) {
    hour = '0' + hour;
  }

  if (minute < 10) {
    minute = '0' + minute;
  }

  const fullTime = `${date} ${month[monthIndex]} ${year} ${hour}:${minute} WIB`;

  return fullTime;
}
