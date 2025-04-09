import UserLocation from "./UserLocation.mjs";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const userLocation = new UserLocation();
const location = await userLocation.getLocation()

console.log(location);



