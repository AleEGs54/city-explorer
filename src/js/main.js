import UserLocation from "./UserLocation.mjs";
import Map from "./Map.mjs";
import { buildSimpleCard, buildBodyCarousel } from "./userInterface.mjs";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Initializes the app: gets user location, loads the map, displays markers and UI.
*/
async function initApp() {
    try {
        const userLocation = new UserLocation();
        const locationData = await userLocation.getLocation();
        console.log("User location:", locationData);

        const map = new Map(locationData, apiKey);

        map.init(); // loads Google Maps API
        await map.initMap(); // creates the map
        await map.nearbySearch(['restaurant', 'movie_theater', 'park', 'shopping_mall']); // gets places

        
        //Sets the name of the city and displays it.
        const cityName = await map.getCityFromCoordinates();
        buildBodyCarousel(`Top in ${cityName}`, document.querySelector('.suggestions-section-top-location'));

        //Builds the 'Top in your location'
        const dataTop = map.gatheredData;
        dataTop.forEach((place) => {
            if (Math.round(place.rating) === 5) buildSimpleCard(document.querySelector('.suggestions-section-top-location .carousel-container'), place);
        })

        //Builds the 'Best Restaurants Next To You'
        await map.nearbySearch(['restaurant'])

        const dataRestaurants = map.gatheredData;

        buildBodyCarousel(`Best Restaurants Next To You`, document.querySelector('.suggestions-section-restaurants'));

        dataRestaurants.forEach((place) => {
            if (Math.round(place.rating) >= 4) buildSimpleCard(document.querySelector('.suggestions-section-restaurants .carousel-container'), place);
        })

        //Builds the 'Wanna Chill?'
        await map.nearbySearch(['movie_theater', 'park', 'shopping_mall'])

        const dataChill = map.gatheredData;

        buildBodyCarousel(`Wanna Chill?`, document.querySelector('.suggestions-section-wanna-chill'));

        dataChill.forEach((place) => {
            if (Math.round(place.rating) >= 4) buildSimpleCard(document.querySelector('.suggestions-section-wanna-chill .carousel-container'), place);
        })

    } catch (error) {
        console.error("An error occurred during app initialization:", error);
    }
}

// Run the app
initApp();