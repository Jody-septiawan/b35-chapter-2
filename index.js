const express = require('express');

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

app.set('view engine', 'hbs'); //setup template engine / view engine

app.use('/public', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/blog', (req, res) => {
  const newBlog = blogs.map((blog) => {
    blog.time = getFullTime(blog.postedAt);
    blog.isLogin = isLogin;
    return blog;
  });

  console.log('newBlog --------------------');
  console.log(newBlog);

  res.render('blog', { isLogin: isLogin, blogs: newBlog });
});

app.get('/add-blog', (req, res) => {
  res.render('form-blog');
});

app.post('/add-blog', (req, res) => {
  const data = req.body;

  data.postedAt = new Date();
  data.author = 'Jody Septiawan';

  blogs.push(data);

  res.redirect('/blog');
});

app.get('/detail-blog/:index', (req, res) => {
  const index = req.params.index;

  const blog = blogs[index];

  blog.time = getFullTime(blog.postedAt);

  res.render('blog-detail', { data: index, blog });
});

app.get('/delete-blog/:index', (req, res) => {
  const index = req.params.index;
  blogs.splice(index, 1);

  res.redirect('/blog');
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
