'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
    const actors = await fetchActors();
    renderActors(actors.results)
};

// Don't touch this function please
const constructUrl = (path) => {
    return `${TMDB_BASE_URL}/${path}?api_key=${atob(
        "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
    )}`;
};

const fetchActors = async () => {
    const url = constructUrl('person/popular')
    const res = await fetch(url)
    return res.json();
};

const fetchActorDetails = async (actorID) => {
    const url = constructUrl('person/'+actorID)
    const res = await fetch(url)
    return res.json();
};
const showActor = async (actor_id) => {
    const actor = await fetchActorDetails(actor_id);
    renderActor(actor)
};


const renderActor = (actor)=>{
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
    CONTAINER.appendChild(actorDiv)
}
function getGender(number) {
    switch (number) {
        case 1:
            return 'female'
        case 2 :
            return 'male'
    }
}

const renderActors = (actors) => {
    console.log(actors)

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
        actorDiv.addEventListener('click', (e)=>{
            showActor(actor.id)
        })

        CONTAINER.appendChild(actorDiv)
    });


}


document.addEventListener("DOMContentLoaded", autorun);