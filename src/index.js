import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries, populationFormat } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const liEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const name = e.target.value.trim();

  divEl.innerHTML = '';
  liEl.innerHTML = '';

  if (!name) {
    return;
  }

  fetchCountries(name)
    .then(countries => {
      if (countries.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      addCountry(countries);
    })
    .catch(err => Notify.failure('Oops, there is no country with that name'));
}

function addCountry(countries) {
  if (countries.length === 1) {
    addCountryOnDiv(countries);
  } else {
    addCountryOnList(countries);
  }
}

function addCountryOnDiv(country) {
  const markup = country
    .map(({ flags, name, capital, population, languages }) => {
      const totalPeople = populationFormat(population);
      return `
        <ul class="country-info__list">
            <li class="country-info__item">
                <img width="200px" height="100px" src='${flags.svg}'
      alt='${name.official} flag' /></li>
            <li class="country-info__item country-info__item--name"><p><b>Name: </b>${
              name.official
            }</p></li>
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${totalPeople}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(
              languages
            )}</p></li>
        </ul>`;
    })
    .join('');
  divEl.innerHTML = markup;
}
function addCountryOnList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
                <li class="country-list__item">
                    <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 25px height = 25px>
                    <p class="country-list__name">${name.official}</p>
                </li>
                `;
    })

    .join('');

  liEl.innerHTML = markup;
}
