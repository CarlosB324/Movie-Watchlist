const watchlistInfoSection = document.getElementById("watchlist-info-section")
let localWatchlist = []

/* Getting Watchlist */
if (localStorage.getItem("movie")) {
    localWatchlist = JSON.parse(localStorage.getItem('movie'))
}

if (localWatchlist.length > 0) {
    watchlistInfoRender()
} else {
     emptyWatchlistRender()
}

window.addEventListener('beforeunload', function(e) {
    localStorage.setItem('movie', JSON.stringify(localWatchlist))
})

/* Handle Button Click */
document.addEventListener('click', handleClick)

function handleClick(e) {
    e.preventDefault()
    if (e.target.id === "to-movie-search") {
        window.location="index.html"
    } else if (e.target.dataset.watchlist) {
        removeBtn(e.target.dataset.watchlist)
    }
}

/* Watchlist Info Section */
function displayImage(poster) {
    if (poster == "N/A" ) {
        return "images/No-Image-Placeholder.png"
    } 
    return poster
}

function getWatchlistHtml() {
    let watchlistHtml = ``
    
    localWatchlist.map((movieData) => {
        watchlistHtml += `
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
                            <i class="fa-solid fa-circle-minus"></i> Remove</button>
                    </div>
                    <p class="gray">${movieData.plot}</p>
                </div>
            </div>
            `
    })
    return watchlistHtml
}

function removeBtn(itemId) {
    let index = localWatchlist.findIndex( item => item.id == itemId)
    localWatchlist.splice(index, 1)
    document.getElementById("remove-from-wl").style.opacity = 1
    document.getElementById("remove-from-wl").style.bottom = "40px"
    setTimeout(function(){
        document.getElementById("remove-from-wl").style.opacity = 0
        document.getElementById("remove-from-wl").style.bottom = 0
    }, 1500)
    if(localWatchlist.length === 0) {
        emptyWatchlistRender()
    } else {
        watchlistInfoRender()
    }
}

/* Render Section */
function watchlistInfoRender() {
    watchlistInfoSection.innerHTML = getWatchlistHtml()
}

function emptyWatchlistRender() {
    watchlistInfoSection.innerHTML = `
        <div class="watchlist-start">
            <h3>Your watchlist is looking a little empty...</h3>
            <a class="add-movies" id="add-movies">
                <i class="fa-solid fa-circle-plus"></i> Let's add some movies!
            </a>
        </div>`
}
