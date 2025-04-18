import { loadHeaderFooter } from './utils.mjs'
import Map from './Map.mjs';
import PlaceDetails from './placeDetails.mjs';
import { getLocalStorage } from './localStorageManagement.mjs';

loadHeaderFooter();

const favoritesIdList = getLocalStorage('likedPlaces')
const visitedIdList = getLocalStorage('visitedPlaces')

//const id = getParam('place');
const map = new Map();
map.init()

const fields = ['displayName', 'photos', 'rating', 'userRatingCount', 'reviews', 'priceLevel', 'primaryType', 'types', 'regularOpeningHours']

favoritesIdList.forEach(async (id) => {
    const placeInfo = await map.getPlaceDetailsById(id, fields);
    const placeDetails = new PlaceDetails(placeInfo);
    placeDetails.displayInformativeCard('.favorite-cards');
    
});

visitedIdList.forEach(async (id) => {
    const placeInfo = await map.getPlaceDetailsById(id, fields);
    const placeDetails = new PlaceDetails(placeInfo);
    placeDetails.displayInformativeCard('.visited-cards');
    
});

