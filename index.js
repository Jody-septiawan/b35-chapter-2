const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');

const db = require('./connection/db');

const app = express();
const PORT = 80;

const isLogin = true;

// db.connect(function (err, _, done) {
//   if (err) throw err;

//   console.log('Database Connection Success');
//   done();
// });

app.set('view engine', 'hbs'); //setup template engine / view engine

app.use('/public', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  })
);

app.use(flash());

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
        blog.isLogin = req.session.isLogin;
        blog.icon = '<h2>Hello</h2>';
        return blog;
      });

      res.render('blog', {
        isLogin: req.session.isLogin,
        user: req.session.user,
        blogs: newBlog,
      });
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

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  let password = req.body.password;

  password = bcrypt.hashSync(password, 10);

  db.connect(function (err, client, done) {
    if (err) throw err;

    const query = `INSERT INTO tb_user(name,email,password) 
                    VALUES('${name}','${email}','${password}');`;

    client.query(query, function (err, result) {
      if (err) throw err;

      if (err) {
        res.redirect('/register');
      } else {
        res.redirect('/login');
      }
    });

    done();
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == '' || password == '') {
    req.flash('warning', 'Please insert all fields');
    return res.redirect('/login');
  }

  db.connect(function (err, client, done) {
    if (err) throw err;

    const query = `SELECT * FROM tb_user WHERE email = '${email}';`;

    client.query(query, function (err, result) {
      if (err) throw err;

      const data = result.rows;

      if (data.length == 0) {
        req.flash('error', 'Email not found');
        return res.redirect('/login');
      }

      const isMatch = bcrypt.compareSync(password, data[0].password);

      if (isMatch == false) {
        req.flash('error', 'Password not match');
        return res.redirect('/login');
      }

      req.session.isLogin = true;
      req.session.user = {
        id: data[0].id,
        email: data[0].email,
        name: data[0].name,
      };

      req.flash('success', `Welcome, <b>${data[0].email}</b>`);

      res.redirect('/blog');
    });

    done();
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/blog');
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
