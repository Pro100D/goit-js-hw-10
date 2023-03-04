import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener(
  'input',
  debounce(evt => {
    clearHtml();
    const inputSearch = input.value.trim();
    if (inputSearch !== '') {
      fetchCountries(inputSearch).then(countrys => {
        console.log(countrys);
        if (countrys.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (countrys.length >= 2 && countrys.length <= 10) {
          creatingListOfCountries(countrys);
        } else if (countrys.length === 1) {
          createCountryInfo(countrys);
        } else if (countrys.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        }
      });
    }
    clearHtml();
  }, DEBOUNCE_DELAY)
);

function creatingListOfCountries(countrys) {
  const markupCountrys = countrys
    .map(country => {
      return `<li class="country-item">
             <img src="${country.flags.svg}" alt="${country.name.official}" width="30" hight="20">
             <p>${country.name.official}</p>
            </li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markupCountrys);
}

function createCountryInfo(country) {
  const markupCountry = country.flatMap(el => {
    return `<div class="country-title">
              <img src="${el.flags.svg}" alt="${
      el.name.official
    }" width="80" hight="70"">
              <h1>${el.name.official}</h1>
            </div>
           <div>
              <p>Capital: ${el.capital}</p>
              <p>Population: ${el.population}</p>
              <p>Languages: ${Object.values(el.languages)}</p>
           </div>`;
  });
  countryInfo.insertAdjacentHTML('beforeend', markupCountry);
}

function clearHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
