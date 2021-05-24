const pokemons = document.querySelectorAll('.item-list');
const nextEvolutions = document.querySelectorAll('.next-evolution');

const renderLink = (items) => {
  for (let item of items) {
    item.addEventListener('click', () => {
      const pokemonId = item.getAttribute('id');
      window.location.href = `/pokemon-token?id=${Number(pokemonId)}`;
    });
  }
}

renderLink(pokemons);
renderLink(nextEvolutions);
