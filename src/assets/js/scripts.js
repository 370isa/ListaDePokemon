const tokenID = document.querySelectorAll('.link-id');
const tokenName = document.querySelectorAll('.link-name');

const renderLink = (items, uri, type) => {
  for (let item of items) {
    item.addEventListener('click', () => {
      const pokeSearch = type == 'int' ? `id=${Number(item.getAttribute('id'))}` : `name=${item.getAttribute('id')}`;
      uri = uri == '' ? item.getAttribute('name') : uri;
      window.location.href = `/${uri}?${pokeSearch}`;
    });
  }
}

renderLink(tokenID, 'pokemon-token', 'int');
renderLink(tokenName, '', 'str');

const voltar = () => {
  // history.go(1)
  window.history.back();
}