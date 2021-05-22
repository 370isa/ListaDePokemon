const express = require('express');
const axios = require('axios');
const nunjucks = require('nunjucks');

const server = express();

server.use(express.static('dist'));

server.set('view engine', 'njk');

nunjucks.configure('src/views', {
  express: server,
  autoescape: false,
  noCache: true
});

server.get('/', async(req, res) => {
  // a resposta do axios se chame 'response', mas eu tiro o 'data' de dentro do response.
  const { data } = await axios('https://www.canalti.com.br/api/pokemons.json');

  return res.render('list', { items: data.pokemon });
});

server.listen(5000, function() {
  console.log('server is running!');
});