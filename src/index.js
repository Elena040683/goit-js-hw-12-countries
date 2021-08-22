import debounce from 'lodash.debounce';
import { alert, error } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';
import fetchCountries from './js/fetchCountries';
import countryTpl from './templates/country.hbs';

const refs = {
  input: document.querySelector('#search'),
  container: document.querySelector('.container'),
};

refs.input.addEventListener('input', debounce(onInputChange, 500));

function onInputChange(e) {
  e.preventDefault();
  const searchQuery = refs.input.value;
  fetchCountries(searchQuery).then(data => countriesLoadResult(data));
}

function countriesLoadResult(data) {
  if (data.length === 1) {
    resetSearch();
    countryRender(data);
  } else if (data.length > 1 && data.length <= 10) {
    resetSearch();
    renderCollection(data);
  } else if (data.length > 10) {
    error({
      text: 'Too many matches found. Please enter a more specific query!',
    });
  }
}

function resetSearch() {
  refs.container.innerHTML = '';
}

function markupCountries({ name }) {
  const country = `<li>${name}</li>`;
  refs.container.insertAdjacentHTML('beforeend', country);
}

function renderCollection(arr) {
  arr.forEach(el => markupCountries(el));
}

function countryRender() {
  refs.container.insertAdjacentHTML('beforeend', countryTpl);
}
