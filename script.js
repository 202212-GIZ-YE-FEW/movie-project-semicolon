'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".movies-container");
const singleMovieContainer = document.querySelector('.single-movie-container')
const singleActorContainer = document.querySelector('.single-actor-container')
const actorsContainer = document.querySelector('.actors-container')
const actorsPageLink = document.getElementById("actorsPage");
const homePageLink = document.getElementById("home");
const genresList = document.querySelector(".dropdown-menu.genres");
const searchBar = document.getElementById("searchBar");
const searchResults = document.getElementById("results")


actorsPageLink.addEventListener('click', (e) => {
    e.preventDefault();
    showActors();
})
homePageLink.addEventListener('click', (e) => {
    e.preventDefault();
    showMovies()
})

// Don't touch this function please
const autorun = async () => {
    showMovies(`movie/now_playing`);
    showGenres()
};

// Don't touch this function please
const constructUrl = (path, query = "") => {
    return `${TMDB_BASE_URL}/${path}?api_key=${atob(
        "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
    )}${query}`
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
    const movieRes = await fetchMovie(movie.id);
    const credits = await fetchMovieCredits(movie.id)
    renderMovie(movieRes, credits.cast);
};


const showMovies = async (link, query) => {
    const movies = await fetchMovies(link, query);
    renderMovies(movies.results);
};


// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async (link, query) => {
    const url = constructUrl(link, query);
    const res = await fetch(url);
    return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
    const url = constructUrl(`movie/${movieId}`);
    const res = await fetch(url);
    return res.json();
};
const fetchMovieCredits = async (movieId) => {
    const url = constructUrl(`movie/${movieId}/credits`);
    const res = await fetch(url);
    return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
    actorsContainer.innerHTML = ""
    singleMovieContainer.innerHTML = ""
    singleActorContainer.innerHTML = ""
    CONTAINER.innerHTML = "";
    movies.map((movie) => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("col");
        movieDiv.style.cursor = "pointer";
        movieDiv.innerHTML = `
        <div class="card">
            <img class="card-img-top" src=${PROFILE_BASE_URL + movie.poster_path} alt="${movie.title} poster">
            <div class="card-body">
            <h5 class="card-title text-danger">${movie.title}</h5>
        </div>
    `;
        movieDiv.addEventListener("click", () => {
            movieDetails(movie);
        });
        CONTAINER.appendChild(movieDiv);
    });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, credits) => {
    CONTAINER.innerHTML = '';
    singleMovieContainer.innerHTML = `
        <div class="col-md-4">
            <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        <div class="row">
        <div class="col-12">
                    <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
        </div>
</div>
`;

    const actorsList = singleMovieContainer.querySelector("#actors");
    credits.forEach((credit) => {
        const actor = document.createElement('li')
        actor.innerHTML = `
         <img id="movie-backdrop" src=${
            BACKDROP_BASE_URL + credit.profile_path
        } alt="">
         <span>${credit.name}</span>
        `
        actor.addEventListener('click', (e) => {
            showActor(credit.id)
        })
        actorsList.appendChild(actor)
    })
};

// Actors
const showActors = async () => {
    const actors = await fetchActors();
    renderActors(actors.results)
};

const fetchActors = async () => {
    const url = constructUrl('person/popular')
    const res = await fetch(url)
    return res.json();
};


const renderActors = (actors) => {
    CONTAINER.innerHTML = ''
    singleActorContainer.innerHTML = ''
    actors.map((actor) => {
        const actorDiv = document.createElement('div')
        actorDiv.innerHTML =
            `
            <div class="card text-bg-dark" style="width: 300px"
                onclick="fetchActorDetails(${actor.id})"
            >
              <img class="card-img" src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name}" width="50">
              <div class="card-img-overlay">
                <h5 class="card-title">${actor.name}</h5>
                <p class="card-text">${getGender(actor.gender)}</p>
                <p class="card-text">Popularity<small>${actor.popularity}</small></p>
              </div>
            </div>
    `;
        actorDiv.addEventListener('click', (e) => {
            showActor(actor.id)
        })

        actorsContainer.appendChild(actorDiv)
    });


}


const fetchActorDetails = async (actorID) => {
    const url = constructUrl('person/' + actorID)
    const res = await fetch(url)
    return res.json();
};

const showActor = async (actor_id) => {
    const actor = await fetchActorDetails(actor_id);
    renderActor(actor)
};

const renderActor = (actor) => {
    const actorDiv = document.createElement('div')
    actorDiv.innerHTML = `
            <div class="card text-bg-dark" style="width: 500px">
              <img class="card-img" src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name}" width="50">
              <div class="card-img-overlay">
                <h5 class="card-title">${actor.name}</h5>
                <p class="card-text">${getGender(actor.gender)}</p>
                <p class="card-text">Popularity<small>${actor.popularity}</small></p>
              </div>
            </div>
    `

    CONTAINER.innerHTML = '';
    actorsContainer.innerHTML = ""
    singleMovieContainer.innerHTML = ''
    singleActorContainer.appendChild(actorDiv)
}


// Genres
const fetchGenres = async () => {
    const url = constructUrl('genre/movie/list')
    const res = await fetch(url)
    return res.json();
};

const showGenres = async () => {
    const genres = await fetchGenres();
    renderGenres(genres.genres)
};

const renderGenres = (genres) => {
    for (const genre of genres) {
        const item = document.createElement('a')
        item.classList.add("dropdown-item")
        item.setAttribute("href", "#")

        item.textContent = genre.name;

        item.addEventListener('click', function (e) {
            e.preventDefault();
            showMovies('/discover/movie', "&with_genres=" + genre.id)
        })

        genresList.appendChild(item)
    }
}


// search movies

// search/movie   &query=[MOVIE_TITLE]
searchBar.addEventListener("input", async function (e) {
    const url = constructUrl('search/movie', '&query=' + searchBar.value)
    if (searchBar.value !== ""){
        searchResults.style.display = "initial"
        let res = await fetch(url)
        res = await res.json();
        res = res.results;

        while (searchResults.firstChild) {
            searchResults.removeChild(searchResults.firstChild);
        }

        if(res.length > 0){
            for (const result of res) {
                const div = document.createElement("a");
                div.classList.add("d-flex");
                div.textContent = result.title;
                div.addEventListener("click", function (e){
                    e.preventDefault();
                    movieDetails(result);
                })
                searchResults.appendChild(div)
            }
        }else{
            const div = document.createElement("div");
            div.classList.add("d-flex");
            div.textContent = "no movie found for "+searchBar.value;
            searchResults.appendChild(div)
        }

    }else{
        searchResults.style.display = "none"
    }

})


function getGender(number) {
    switch (number) {
        case 1:
            return 'female'
        case 2 :
            return 'male'
    }
}

const checkbox = document.getElementById("checkbox")
checkbox.addEventListener("change", () => {
    document.querySelector("body").dataset["bsTheme"] = checkbox.checked ? "dark" : "light"

})

const searchBox = document.getElementById('searchBox'),
    searchIcon = document.getElementById('searchIcon');

searchIcon.onclick = function () {
    searchBox.classList.toggle('active');
    searchResults.classList.toggle("d-none")

};


document.addEventListener("DOMContentLoaded", autorun);
