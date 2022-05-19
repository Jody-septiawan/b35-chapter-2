const express = require('express');

const app = express();
const PORT = 5089;

app.get('/', (request, response) => {
  response.send('Main Page');
});

app.get('/beranda', function (request, response) {
  response.send('Beranda Page');
});

app.listen(PORT, function () {
  console.log(`Server running on PORT: ${PORT}`);
});
