import React from 'react'
import "./App.css"

const spinner = document.querySelector('.fa-spinner');
const gridContainer = document.querySelector('.grid-container');
const singleContainer = document.querySelector('.single-container');
const moreInfoWrapper = document.querySelector('.single-celebrity-wrapper');
const pagination = document.querySelector('.pagination');
let currentCelebrities = [];
let favoriteCelebrities = [];
let pageNumber = 1;

const movieUrl =
  'https://api.themoviedb.org/3/person/popular?api_key=df8b08ecb436696fee41a00f8d87a540&language=en&page=';

function createCelebrities() {
  gridContainer.innerHTML = '';
  gridContainer.style.display = 'none';
  spinner.style.display = 'block';
  fetch(`${movieUrl}${pageNumber}`)
    .then((res) => res.json())
    .then((data) => {
      setTimeout(() => {
        gridContainer.style.display = 'grid';
        spinner.style.display = 'none';
        currentCelebrities = data.results;
        paintUI(currentCelebrities);
      }, 800);
    });
}

createCelebrities();

function paintUI(celebs) {
  for (let person of celebs) {
    const gridItem = `
      <div class="grid-item">
        <img src="http://image.tmdb.org/t/p/w185${person.profile_path}" alt="" />
        <p>${person.name}</p>
        <div class="btns more-info" onclick="moreInfoFn(${person.id})">More Info</div>
        <div class="btns add-favorite" onclick="addToFavoritesFn(${person.id})">
          Add To Favorites
        </div>
      </div>`;
    gridContainer.innerHTML += gridItem;
  }
}

function moreInfoFn(id) {
  gridContainer.style.display = 'none';
  moreInfoWrapper.style.display = 'block';
  pagination.style.display = 'none';
  console.log(id);
  // for loop
  // array filter = []
  // find = {}
  // const celebrity = currentCelebrities.filter((person) => person.id === id);
  const celebrity = currentCelebrities.find((person) => person.id === id);
  console.log(celebrity);
  const knownForMovies = celebrity.known_for
    .map((movie) => {
      return `<div class="each-movie">
        <div class="movie-poster">
          <img src="http://image.tmdb.org/t/p/w45/${movie.poster_path}" alt="" />
        </div>
        <div class="each-movie-title">${movie.title}</div>
      </div>`;
    })
    .join(''); // [div, div, div]

  const eachItem = `
      <div class="single-item">
        <img src="http://image.tmdb.org/t/p/h632/${celebrity.profile_path}" alt="" />
      </div>
      <div class="single-item">
        <p>Popularity: <span>${celebrity.popularity}</span></p>
        <p>Movies ${celebrity.name} played in:</p>
        <div class="known-for-movies">
          ${knownForMovies}
        </div>
      </div>`;
  singleContainer.innerHTML = eachItem;
}

function addToFavoritesFn(id) {
  currentCelebrities.forEach((item) => {
    if (item.id === id) {
      item.isFavorite = true;
    }
  });
  const stringed = JSON.stringify(
    currentCelebrities.filter((item) => item.isFavorite)
  );
  localStorage.setItem('favorites', stringed);
  console.log(currentCelebrities);
}

function goBackFn() {
  pagination.style.display = 'block';
  gridContainer.style.display = 'grid';
  moreInfoWrapper.style.display = 'none';
  createCelebrities();
}

function displayFavoritesFn() {
  gridContainer.innerHTML = '';
  const data = localStorage.getItem('favorites');
  const parsed = JSON.parse(data);
  paintUI(parsed);
}

function paginationFn(step) {
  console.log('step', step);
  if (step === 'prev') {
    pageNumber--;
  }

  if (step === 'next') {
    pageNumber++;
  }
  console.log('pageNumber', pageNumber);
  createCelebrities();
}
export default App;

