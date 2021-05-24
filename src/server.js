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

const apiPokemon = async() => {
  // a resposta do axios se chame 'response', mas eu tiro o 'data' de dentro do response.
  const { data } = await axios('https://www.canalti.com.br/api/pokemons.json');
  return data;
}

server.get('/', async(req, res) => {
  const { pokemon } = await apiPokemon();

  return res.render('list', { items: pokemon });
});

server.get('/pokemon-token', async(req, res) => {
  const id = req.query.id;

  const { pokemon } = await apiPokemon();

  const pokeId = pokemon.find((poke) => {
    return poke.id == id;
  });

  if (!pokeId)
    return res.send('Pokemon not found!');

  return res.render('pokemon-token', { item: pokeId });
});

server.listen(5000, () => {
  console.log('server is running!');
});