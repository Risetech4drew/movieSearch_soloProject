let moviesByIds = [];
let moviesFound = [];
let moviesFoundPromisesArr = [];

document.getElementById("search-btn").addEventListener("click", function () {
  console.log("button is clicked");
  const searchInputValue = document.getElementById("search-el").value;
  //   console.log(searchInput);
  fetch(
    `http://www.omdbapi.com/?apikey=52558a9&s=${searchInputValue}&type=movie`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      //   mapping over data.search to return an array of movie IDs
      moviesByIds = data.Search.map(function (movie) {
        return movie.imdbID;
      });
      moviesFoundPromisesArr = moviesByIds.map(function (movieId) {
        return fetch(
          `http://www.omdbapi.com/?apikey=52558a9&i=${movieId}`
        ).then((res) => res.json());
      });
      resolvePromisesArray();
    });
});

function resolvePromisesArray() {
  Promise.all(moviesFoundPromisesArr).then(function (resolvedArr) {
    moviesFound = resolvedArr;
    console.log(moviesFound);
    renderMovies();
  });
}
function renderMovies() {
  let moviesHtml = "";
  moviesFound.forEach(function (movie) {
    moviesHtml += `
    <div class="movie">
      <img src="${movie.Poster}"/>
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
            <img src="/imgs/add-icon.png" class="add-icon">
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
