import UserLocation from "./UserLocation.mjs";
import Map from "./Map.mjs";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const userLocation = new UserLocation();

/**
 * This function gets the location and uses it as parameter for the Map instance. It gets called inmediatelly;
 */
(async () => {
  const locationData = await userLocation.getLocation();
  console.log(locationData)

  //Creates a new map instance
  const map = new Map(locationData, apiKey);
  map.init();
})();







