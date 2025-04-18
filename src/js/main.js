import UserLocation from "./UserLocation.mjs";
import Map from "./Map.mjs";
import { setLocalStorage } from "./localStorageManagement.mjs";
import { buildSimpleCard, buildBodyCarousel, initializeIconStates, attachCardIconListeners } from "./userInterface.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import Weather from "./Weather.mjs";


async function initApp() {


  //builds header and footer
  loadHeaderFooter();

  try {
    const userLocation = new UserLocation();
    const locationData = await userLocation.getLocation();


    const map = new Map();

    map.init(); // Load Google Maps API
    await map.initMap(locationData, true);

    const weather = new Weather(locationData);
    weather.init();


    // Store the location in localStorage only if it was successfully retrieved
    if (locationData.lat !== 43.81463458983826 && locationData.lng !== -111.78321208736119) {
      setLocalStorage('lastLocation', locationData);
    }

    // Load all categories initially
    await map.nearbySearch(['restaurant', 'movie_theater', 'park', 'shopping_mall', 'museum']);

    //Get the city's name
    const cityName = await map.getCityFromCoordinates();

    renderSection(`Top in ${cityName}`, '.suggestions-section-top-location', place => Math.round(place.rating) === 5, map);

    await map.nearbySearch(['restaurant']);
    renderSection('Best Restaurants Next To You', '.suggestions-section-restaurants', place => Math.round(place.rating) >= 4, map);

    await map.nearbySearch(['movie_theater', 'park', 'shopping_mall']);
    renderSection('Wanna Chill?', '.suggestions-section-wanna-chill', place => Math.round(place.rating) >= 4, map);

    attachCardIconListeners();
    initializeIconStates();

    //Card animation
    const suggestionsContainers = document.querySelectorAll('.suggestions-cards-container');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Stop observing once visible
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

    suggestionsContainers.forEach(container => {
      observer.observe(container);
    })


    //filters!!!
    const filterButtons = document.querySelectorAll('.filter-button');

    filterButtons.forEach(fButton => {
      const filterType = fButton.dataset.filter;
      fButton.addEventListener('click', () => {
        displayFilteredResultsOnMap(filterType, map);
      })
    })

    //end filters!!!



  } catch (error) {
    console.error("An error occurred during app initialization:", error);
  }
}

/**
 * Renders a section with filtered places and builds the carousel and cards
 */
function renderSection(title, sectionSelector, filterFn, mapInstance) {
  const section = document.querySelector(sectionSelector);
  buildBodyCarousel(title, section);

  const container = section.querySelector('.carousel-container');
  mapInstance.gatheredData
    .filter(filterFn)
    .forEach(place => buildSimpleCard(container, place));
}





async function displayFilteredResultsOnMap(filterType, mapInstance) {
  const filterOptions = {
    'no-filter': ['restaurant', 'movie_theater', 'park', 'shopping_mall', 'museum'],
    'entertainment': [
      'amusement_park', 'plaza', 'national_park', 'tourist_attraction',
      'concert_hall', 'aquarium', 'zoo', 'water_park', 'movie_theater'
    ],
    'shopping': [
      'grocery_store', 'supermarket', 'department_store', 'convenience_store',
      'shopping_mall', 'warehouse_store', 'book_store', 'electronics_store',
      'clothing_store', 'home_goods_store'
    ]
  };

  const filters = filterOptions[filterType] || [filterType];
  await mapInstance.nearbySearch(filters);
}

// Run the app
initApp();