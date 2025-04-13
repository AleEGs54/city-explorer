import UserLocation from "./UserLocation.mjs";
import Map from "./Map.mjs";
import { buildSimpleCard, buildBodyCarousel, setIconState, initializeIconStates } from "./userInterface.mjs";
import { toggleItemInStorage } from "./localStorageManagement.mjs";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

async function initApp() {
  try {
    const userLocation = new UserLocation();
    const locationData = await userLocation.getLocation();
    console.log("User location:", locationData);

    const map = new Map(locationData, apiKey);

    map.init(); // Load Google Maps API
    await map.initMap();

    // Load all categories initially
    await map.nearbySearch(['restaurant', 'movie_theater', 'park', 'shopping_mall']);
    const cityName = await map.getCityFromCoordinates();

    renderSection(`Top in ${cityName}`, '.suggestions-section-top-location', place => Math.round(place.rating) === 5, map);

    await map.nearbySearch(['restaurant']);
    renderSection('Best Restaurants Next To You', '.suggestions-section-restaurants', place => Math.round(place.rating) >= 4, map);

    await map.nearbySearch(['movie_theater', 'park', 'shopping_mall']);
    renderSection('Wanna Chill?', '.suggestions-section-wanna-chill', place => Math.round(place.rating) >= 4, map);

    attachCardIconListeners();
    initializeIconStates();

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

/**
 * Adds event listeners to all cards for like/visited icons
 */
function attachCardIconListeners() {
  const cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    const actions = [
      { iconClass: '.suggestion-heart-icon', storageKey: 'likedPlaces' },
      { iconClass: '.suggestion-check-icon', storageKey: 'visitedPlaces' },
    ];

    actions.forEach(({ iconClass, storageKey }) => {
      const icon = card.querySelector(iconClass);
      if (!icon) return;

      icon.addEventListener('click', () => {
        toggleItemInStorage(storageKey, card.dataset.id);
        setIconState(card, iconClass);
      });
    });
  });
}

// Run the app
initApp();