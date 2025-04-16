import { getParam, loadHeaderFooter } from './utils.mjs'
import Map from './Map.mjs';
import PlaceDetails from './placeDetails.mjs';

loadHeaderFooter();

const id = getParam('place');
const map = new Map();
map.init()

const fields = ['displayName', 'photos', 'rating', 'userRatingCount', 'reviews', 'priceLevel', 'regularOpeningHours','websiteURI','internationalPhoneNumber', 'formattedAddress', 'location', 'svgIconMaskURI', 'iconBackgroundColor']
const placeInfo = await map.getPlaceDetailsById(id, fields);

const placeDetails = new PlaceDetails(placeInfo);
placeDetails.displayDetailedCard()
map.initMap(placeInfo.location)
map.buildAdvancedMarker(placeInfo)