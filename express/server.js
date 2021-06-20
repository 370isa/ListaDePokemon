'use strict';

const express = require('express');
const axios = require('axios');
const nunjucks = require('nunjucks');

const serverless = require('serverless-http');
const server = express();
const bodyParser = require('body-parser');
const router = express.Router();

server.use(express.static('dist'));

server.set('view engine', 'njk');

nunjucks.configure('src/views', {
  express: server,
  autoescape: false,
  noCache: true
});

const apiPokemon = async() => {
  // a resposta do axios se chame 'response', e eu tiro o 'data' de dentro do response.
  const { data } = await axios('https://www.canalti.com.br/api/pokemons.json');
  return data;
}

const filterPokemon = (uri) => {
  router.get(`/${uri}`, async(req, res) => {
    const { pokemon } = await apiPokemon();
    const cat = req.query.name;
    var items = [];

    for (const poke of pokemon) {
      for (const weaknesses of poke.weaknesses) {
        if (weaknesses == cat) {
          items.push(poke);
        }
      }
    }

    if (!items.length)
      return res.redirect('/error-404');

    return res.render('group-list', { items, uri, category: cat });
  });
}

router.get('/', async(req, res) => {
  const { pokemon } = await apiPokemon();

  return res.render('list', { items: pokemon });
});

router.get('/pokemon-token', async(req, res) => {
  const id = req.query.id;

  const { pokemon } = await apiPokemon();

  const pokeId = pokemon.find((poke) => {
    return poke.id == id;
  });

  if (!pokeId)
    return res.redirect('/error-404');

  return res.render('pokemon-token', { item: pokeId });
});

router.get('/error-404', async(req, res) => {
  return res.render('404');
});

filterPokemon('weaknesses');
filterPokemon('type');

server.use('/.netlify/functions/server', router);

module.exports = app;
module.exports.handler = serverless(app);