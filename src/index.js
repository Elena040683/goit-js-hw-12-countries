import debounce from 'lodash.debounce';
import { alert, error } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  input: document.querySelector('#search'),
  container: document.querySelector('.container'),
};

refs.input.addEventListener('input', debounce(onInputChange, 500));

function onInputChange(e) {
  e.preventDefault();
  const searchQuery = refs.input.value;
  fetchCountries(searchQuery);
}

function fetchCountries(searchQuery) {
  fetch(`https://restcountries.eu/rest/v2/name/${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      onMoreThenTenCountriesPerPage(data);
      renderCollection(data.name);
    })
    .catch(err => console.log(err));
}

function onMoreThenTenCountriesPerPage(data) {
  if (data.length > 10) {
    error({
      text: 'Too many matches found. Please enter a more specific query!',
    });
    return;
  }
}

function onTwoUpTenCountriesPerPage(data) {
  if (data.length < 10 && data.length > 2) {
    const country = `<ul><li>${data.name}</li>
    </ul>`;

    refs.container.insertAdjacentHTML('beforeend', country);
  }
}

function renderCollection(arr) {
  arr.forEach(el => {
    onTwoUpTenCountriesPerPage(el);
  });
}
