const searchBar = document.getElementById("search-bar")
const movieInfoSection = document.getElementById("movie-info-section")
const watchlistInfoSection = document.getElementById("watchlist-info-section")
let movieArray = []
let watchlistArray = []


/* Handle Button Click */
document.addEventListener('click', handleClick)

function handleClick(e) {
    e.preventDefault()
    if (e.target.id === "search-btn") {
        movieSearch()
        searchBar.value = ""
    } else if (e.target.dataset.watchlist) {
        getMovieIndex(e.target.dataset.watchlist)
    } else if (e.target.id === "to-watchlist") {
        window.location="watchlist.html"
    }
}

/* Getting Movie Info Section */
function movieSearch() {
    fetch(`https://www.omdbapi.com/?apikey=c6e04130&s=${searchBar.value}`)
        .then(res => res.json())
        .then(data => {
            movieArray.splice(0, movieArray.length)
            try {
                getMovieInfo(data)
                searchBar.placeholder = "Search for a movie"
            }
            catch(err) {
                searchBar.placeholder = "Searching something with no data"
                movieInfoSection.innerHTML = `
                    <h3 class="fail">
                    Unable to find what you’re looking for. Please try another search.
                    </h3>
                `
            }
        }) 
}

function displayImage(poster) {
    if (poster == "N/A" ) {
        return "images/No-Image-Placeholder.png"
    } 
    return poster
}

function getMovieInfo(e) {
    let movies = e.Search
    
    for (movie of movies) {
        fetch(`https://www.omdbapi.com/?apikey=c6e04130&i=${movie.imdbID}`)
            .then(res => res.json())
            .then(movieData => {
                
                let movieObj = {
                    id: movieData.imdbID,
                    title: movieData.Title,
                    rating: movieData.imdbRating,
                    runtime: movieData.Runtime,
                    genre: movieData.Genre,
                    plot: movieData.Plot,
                    poster: movieData.Poster,
                    type: movieData.Type,
                    year: movieData.Year
                }
                movieArray.push(movieObj) 
                movieInfoRender()
            })
    }
}

function getMovieHtml() {
    let movieHtml = ``
    
    movieArray.map((movieData) => {
        movieHtml += `
            <div class="movie-info" id="${movieData.id}">
                <img src="${displayImage(movieData.poster)}">
                <div class="info-section">
                    <div class="name">
                        <h3 class="title">${movieData.title}</h3>
                    </div>
                    <div class="rating-year-type">
                        <p><i class="fa-sharp fa-solid fa-star"></i> ${movieData.rating}</p>
                        <p>${movieData.year}</p>
                        <p>${movieData.type}</p>
                    </div>
                    <div class="time-genre-watchlist">
                        <p>${movieData.runtime}</p>
                        <p>${movieData.genre}</p>
                        <button id="watchlist" data-watchlist="${movieData.id}">
                            <i class="fa-solid fa-circle-plus"></i> Watchlist</button>
                    </div>
                    <p class="gray">${movieData.plot}</p>
                </div>
            </div>
            `
    })
    return movieHtml
}

function getMovieIndex(itemId) {
    let index = movieArray.findIndex( item => item.id == itemId)
    let watchlistIndex = watchlistArray.findIndex( item => item.id == itemId)
    
    if (watchlistIndex === -1) {
        watchlistArray.push(movieArray[index])
        document.getElementById("add-to-wl").style.opacity = 1
        document.getElementById("add-to-wl").style.bottom = "40px"
        setTimeout(function(){
            document.getElementById("add-to-wl").style.opacity = 0
            document.getElementById("add-to-wl").style.bottom = 0
        }, 1500)
    } else {
        document.getElementById("already-in-wl").style.opacity = 1
        document.getElementById("already-in-wl").style.bottom = "40px"
        setTimeout(function(){
            document.getElementById("already-in-wl").style.opacity = 0
            document.getElementById("already-in-wl").style.bottom = 0
        }, 1500)
    }
}

/* Watchlist Local Storage Info */
if (localStorage.getItem("movie")) {
    watchlistArray = JSON.parse(localStorage.getItem('movie'))
}

window.addEventListener('beforeunload', function(e) {
    localStorage.setItem('movie', JSON.stringify(watchlistArray))
})

/* Render Section */
function movieInfoRender() {
    movieInfoSection.innerHTML = getMovieHtml()
}
