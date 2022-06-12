///////////////////////////////////
// SEARCH FOR TV SHOWS
///////////////////////////////////

const container = document.querySelector("#container");
const searchForm = document.querySelector("#searchForm");

let shows = "";

let base = "";
let currentBase = "";

let infoContainer;
let heading;


let searchTerm = "";
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    searchTerm = searchForm.elements.query.value;
    const res = await fetch(`http://api.tvmaze.com/search/shows?q=${searchTerm}`);
    shows = await res.json()

    // Remove previous search results
    container.innerHTML = "";
    
    // Add shows
    for (let show of shows) {

        // Set base url
        base = show.show;

        // Add showCard
        const showCard = document.createElement("div");
        showCard.classList = "show-card";
        container.append(showCard);

        // Add expand icon
        addIcon("plus.png", "expand-icon", showCard);

        // Add show image to showCard
        if (base.image !== null) {
            addImage(base.image.medium, "image-medium", showCard)
        }
        console.log(base); // ERROR when searching for 'girls', entries without medium image
        
        // Add infoContainer
        addInfoContainer(showCard);
        
        // Add title to showCard  
        addTitle(base.name, "show-title");

        // Add rating
        addRating(base.rating.average, "star");

        // Add summary to showCard
        if (show.show.summary) {
            const sum = base.summary;
    
            const text = document.createElement("p");

            function truncateText(text, length) {
                if (text.length <= length) {
                  return text;
                }
              
                return text.substr(0, length) + '\u2026'
              }
            
            let truncated;
            truncated = truncateText(sum, 300);

            text.innerHTML = truncated;
            text.classList = "show-summary";
            infoContainer.append(text);
        }


        // Add genres to showCard
        const genreContainer = document.createElement("div");
        genreContainer.classList = "genre-container";
        infoContainer.append(genreContainer);
        const genres = base.genres;
        for (let i = 0; i < genres.length; i++) {
            const genreEl = document.createElement("span");
            genreEl.textContent = base.genres[i];
            genreEl.classList = "genre";
            genreContainer.append(genreEl);
        }


    }

    searchForm.elements.query.value = "";
})




///////////////////////////////////
// EXPAND AND COLLPAPSE SEARCH RESULTS
///////////////////////////////////

// Expand showCard on click
container.addEventListener("click", (e) => {
    if (e.target.classList.value === "expand-icon") {

        // Remove content
        e.target.parentElement.classList = "showcard-expanded";
        const showCardExpanded = e.target.parentElement;
        showCardExpanded.innerHTML = "";

        // Add collapse icon function call
        addIcon("minus.png", "collapse-icon", showCardExpanded);

        // Get current show
       const cardsArray = container.childNodes;
       let currentCard = ""
       for (let i = 0; i < cardsArray.length; i++) {

            if (cardsArray[i] === showCardExpanded) {
                currentCard = i;

                }      
            }
        
        // Sett current base url
        currentBase = shows[currentCard].show;

        //Add image to showCardExpanded
        addImage(currentBase.image.original, "image-original", showCardExpanded)

        // Add infoContainer function call
        addInfoContainer(showCardExpanded);

        // Add title to showCardExpanded
        addTitle(currentBase.name, "show-title--expanded");

        // Add rating
        addRating(currentBase.rating.average, "star--expanded");
    

        // Add favourite
        const fave = document.createElement("div");
        fave.classList = "fave";
        fave.innerHTML = `<b>Favourite</b>`;
        let faveIcon = document.createElement("span");
        faveIcon.innerHTML = `<img src="heart-outline.png">`;
        fave.append(faveIcon);
        infoContainer.append(fave);

        // Add event listener to favourite element to change heart icon
        fave.addEventListener("click", () => {
            if (faveIcon.innerHTML !== `<img src="heart-fill.png">`) {
                faveIcon.innerHTML = `<img src="heart-fill.png">`;
            } else {
                faveIcon.innerHTML = `<img src="heart-outline.png">`;
            }
            
        })

        // Add language
        if (shows[currentCard].show.language) {
            const language = document.createElement("p");
            language.classList = "language";
            language.innerHTML = `<b>Language:</b> ${shows[currentCard].show.language}`;
            infoContainer.append(language);
        }

        // Add summary
        if (shows[currentCard].show.summary) {
            const sum = document.createElement("p");
            sum.classList = "show-summary--expanded";
            sum.innerHTML = shows[currentCard].show.summary;
            infoContainer.append(sum);
        }
        
        // Add genres 
        if (shows[currentCard].show.genres) {
            const genreContainer = document.createElement("div");
            genreContainer.classList = "genre-container--expanded";
            infoContainer.append(genreContainer);
            const genres = shows[currentCard].show.genres;
            for (let i = 0; i < genres.length; i++) {
                const genreEl = document.createElement("span");
                genreEl.textContent = shows[currentCard].show.genres[i];
                genreEl.classList = "genre--expanded";
                genreContainer.append(genreEl);
            }
        }
    
        // Add where to watch
        const metaContainer = document.createElement("div");
        metaContainer.classList = "meta-container";
        if (shows[currentCard].show.webChannel) {
            const channel = document.createElement("p");
            channel.classList = "channel"
            channel.innerHTML = `<b>Where to watch:</b> ${shows[currentCard].show.webChannel.name}`
            metaContainer.append(channel);
        }
        infoContainer.append(metaContainer);

        // Add number of seasons
        const getSeasons = async () => {
            const res = await fetch(`${shows[currentCard].show._links.previousepisode.href}`);
            lastEp = await res.json()

            const season = document.createElement("p");
            season.classList = "season";
            season.innerHTML = `<b>Number of seasons:</b> ${lastEp.season}`;
            metaContainer.append(season);
        }

        if (shows[currentCard].show._links.previousepisode) {
            getSeasons();
        }


        // Add IMDB Link
        const linkContainer = document.createElement("div");
        linkContainer.classList = "link-container";
        if (shows[currentCard].show.externals.imdb) {
            const imdbLink = document.createElement("p");
            imdbLink.classList = "imdb-link";
            imdbLink.innerHTML = `<a target="_blank" href="https://www.imdb.com/title/${shows[currentCard].show.externals.imdb}">See on IMDB</a>`;
            linkContainer.append(imdbLink);
        }
        infoContainer.append(linkContainer);


        // Add Official Site link
        if (shows[currentCard].show.officialSite) {
            const site = document.createElement("p");
            site.classList = "site";
            site.innerHTML = `<a href="${shows[currentCard].show.officialSite}">Official Site</a>`;
            linkContainer.append(site);
        }
    }
})


// Collapse showCard
container.addEventListener("click", (e) => {
    if (e.target.classList.value === "collapse-icon") {
        const showCardCollapse = e.target.parentElement;
        showCardCollapse.innerHTML = "";

        addIcon("plus.png", "expand-icon", showCardCollapse);

        // Get current show
        const cardsArray = container.childNodes;
        let currentCard = ""
        for (let i = 0; i < cardsArray.length; i++) {

            if (cardsArray[i] === showCardCollapse) {
                currentCard = i;
            }      
        }

         // Sett current base url
         currentBase = shows[currentCard].show;

        // Add show image to showCard
        addImage(currentBase.image.medium, "image-medium", showCardCollapse);

        // Add infoContainer
        addInfoContainer(showCardCollapse);

        // Add title to showCard  
        addTitle(currentBase.name, "show-title");

        // Add rating
        addRating(currentBase.rating.average, "star");

        // Add summary to showCard
        if (currentBase.summary) {
            const sum = currentBase.summary;
    
            const text = document.createElement("p");

            function truncateText(text, length) {
                if (text.length <= length) {
                  return text;
                }
              
                return text.substr(0, length) + '\u2026'
              }
            
            let truncated;
            truncated = truncateText(sum, 300);

            text.innerHTML = truncated;
            text.classList = "show-summary";
            infoContainer.append(text);
        }

        // Add genres to showCard
        const genreContainer = document.createElement("div");
        genreContainer.classList = "genre-container";
        infoContainer.append(genreContainer);
        const genres = currentBase.genres;
        for (let i = 0; i < genres.length; i++) {
            const genreEl = document.createElement("span");
            genreEl.textContent = currentBase.genres[i];
            genreEl.classList = "genre";
            genreContainer.append(genreEl);
        }
    }
})






// Add icon FUNCTION
const addIcon = (src, iconClass, place) => {
    const icon = document.createElement("img");
    icon.src = src;
    icon.classList = iconClass;
    place.append(icon);
}

// Add show image to card FUNCTION
const addImage = (imageType, imageClass, card) => {
    if (imageType) {
        const showImage = document.createElement("img");
        showImage.classList = imageClass;
        showImage.src = imageType;
        card.append(showImage)
    }
}

// Add infoContainer FUNCTION
const addInfoContainer = (card) => {
    infoContainer = document.createElement("div");
    infoContainer.classList = "info-container";
    card.append(infoContainer);
}

// Add title to infoContainer FUNCTION
const addTitle = (titleUrl, titleClass) => {
    heading = document.createElement("h2");
    heading.classList = titleClass;
    heading.innerHTML = `${titleUrl}`;
    infoContainer.append(heading);
}

// Add rating to heading FUNCTION
const addRating = (ratingUrl, iconClass) => {
    if (ratingUrl) {
        const star = document.createElement("img");
        star.src = "star.png";
        star.classList = iconClass;
        heading.append(star);
        const ratingEl = document.createElement("span");
        ratingEl.classList = "rating";
        ratingEl.textContent = ratingUrl;
        heading.append(ratingEl);
    }
}

    
        
