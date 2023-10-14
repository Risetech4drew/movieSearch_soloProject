const searchInputEl = document.getElementById("search-el");
const inputFieldContainer = document.getElementById("input-field-container-el");
const searchBtn = document.getElementById("search-btn");
let moviesByIds = [];
let moviesFound = [];
let moviesFoundPromisesArr = [];
let movieWatchList = [];

const watchListFromLocalStorage = JSON.parse(
  localStorage.getItem("movieWatchList")
);
if (watchListFromLocalStorage) {
  movieWatchList = watchListFromLocalStorage;
}

if (document.getElementById("watchList")) {
  renderWatchList(movieWatchList);
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.movieId) {
    addToWatchList(e.target.dataset.movieId);
  }
});

if (searchBtn) {
  searchBtn.addEventListener("click", function () {
    const searchValue = searchInputEl.value;
    // checking if search input is empty or consists of whitespace using .trim()
    // if (!searchValue.trim()) {
    //   console.log("enter valid search query");
    //   searchInputEl.placeholder = "enter a valid search query";
    // }
    fetch(`https://www.omdbapi.com/?apikey=52558a9&s=${searchValue}&type=movie`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //   mapping over data.search to return an array of movie IDs
        if (data.Search) {
          moviesByIds = data.Search.map(function (movie) {
            return movie.imdbID;
          });
          moviesFoundPromisesArr = moviesByIds.map(function (movieId) {
            return fetch(
              `https://www.omdbapi.com/?apikey=52558a9&i=${movieId}`
            ).then((res) => res.json());
          });
          resolvePromisesArray();
        } else {
          throw Error("Search not found");
        }
      })
      .catch((error) => {
        console.log(error);
        document.getElementById("movies-list").innerHTML = `
                    <p>Unable to find what you’re looking for. Please try another search.</p>
          `;
      });
  });
}

// function applyValidation(shouldApply)
function resolvePromisesArray() {
  Promise.all(moviesFoundPromisesArr).then(function (resolvedArr) {
    moviesFound = resolvedArr;
    console.log(moviesFound);
    renderMovies(moviesFound);
  });
}

function addToWatchList(movieId) {
  console.log(movieId);
  const movie = moviesFound.find(function (movie) {
    return movie.imdbID === movieId;
  });
  console.log(movie);
  movieWatchList.unshift(movie);
  localStorage.setItem("movieWatchList", JSON.stringify(movieWatchList));
}

function renderMovies(Arr) {
  let moviesHtml = "";
  Arr.forEach(function (movie) {
    moviesHtml += `
    <div class="movie">
      <img src="${movie.Poster}" class="movie-poster"/>
      <div class="movie-info">
      <div class="top-movie-info">
       <p class="movie-title">${movie.Title}</p>
       <img src="/imgs/star-icon.png" class="star-icon"/>
       <p class="movie-rating">${movie.imdbRating}</p>
      </div>
      <div class="mid-movie-info">
        <p>${movie.Runtime}</p>
        <p>${movie.Genre}</p>
        <div class="add-to-watchlist">
            <img src="/imgs/add-icon.png" class="add-icon"  id="add-icon" data-movie-Id="${movie.imdbID}">
            <p>Watchlist</p>
        </div>
      </div>
      <div class="bottom-movie-info">
        <p class="movie-plot">${movie.Plot}</p>
      </div>
      </div>
    </div>`;
  });
  document.getElementById("movies-list").innerHTML = moviesHtml;
}

function renderWatchList(Arr) {
  let moviesHtml = "";
  Arr.forEach(function (movie) {
    moviesHtml += `
      <div class="movie">
        <img src="${movie.Poster}" class="movie-poster"/>
        <div class="movie-info">
        <div class="top-movie-info">
         <p class="movie-title">${movie.Title}</p>
         <img src="/imgs/star-icon.png" class="star-icon"/>
         <p class="movie-rating">${movie.imdbRating}</p>
        </div>
        <div class="mid-movie-info">
          <p>${movie.Runtime}</p>
          <p>${movie.Genre}</p>
          <div class="add-to-watchlist">
              <img src="/imgs/remove-icon.png" class="remove-icon" data-movie-Id="${movie.imdbID}">
              <p>Watchlist</p>
          </div>
        </div>
        <div class="bottom-movie-info">
          <p class="movie-plot">${movie.Plot}</p>
        </div>
        </div>
      </div>`;
  });
  document.getElementById("watchList").innerHTML = moviesHtml;
}
