import { getParam ,loadHeaderFooter } from './utils.mjs'
import Map from './Map.mjs';
import PlaceDetails from './placeDetails.mjs';
import { toggleItemInStorage, getLocalStorage } from './localStorageManagement.mjs';
import { setIconState } from './userInterface.mjs';

loadHeaderFooter();

const id = getParam('place');
const map = new Map();
map.init()

const fields = ['displayName', 'photos', 'rating', 'userRatingCount', 'reviews', 'priceLevel', 'regularOpeningHours', 'websiteURI', 'internationalPhoneNumber', 'formattedAddress', 'location', 'svgIconMaskURI', 'iconBackgroundColor'];

(async () => {

    const placeInfo = await map.getPlaceDetailsById(id, fields);
    const placeDetails = new PlaceDetails(placeInfo);
    placeDetails.displayDetailedCard()
    map.initMap(placeInfo.location)
    map.buildAdvancedMarker(placeInfo)

    const heartIcon = document.querySelector('.suggestion-heart-icon');
    const likedPlaces = getLocalStorage('likedPlaces');
    
    if (likedPlaces.includes(placeInfo.id)) {
        heartIcon.classList.add('on');
      } else {
        heartIcon.classList.remove('on');
      }
    
    const buttonFavorites = document.querySelector('.button-favorites');

    buttonFavorites.addEventListener('click', () => {
        toggleItemInStorage('likedPlaces', placeInfo.id);
        setIconState(buttonFavorites, '.suggestion-heart-icon');
    })
})();
