const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
/**
 * Loads the Google Mpas Api to get all the necessary information to init the map.
*/
async function getMap() {
    
    (g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })({
        key: `${apiKey}`,
        v: "weekly",
        // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
        // Add other bootstrap parameters as needed, using camel case.
    });
}

//getMap();

// Objeto global para almacenar la ubicación del usuario
let userLocation = {
    lat: null,
    lng: null
  };
  
  // Función para obtener la ubicación
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        userLocation.lat = position.coords.latitude;
        userLocation.lng = position.coords.longitude;
        console.log("Ubicación obtenida:", userLocation);
        //findPlaces(userLocation.lat, userLocation.lng)
      }, function(error) {
        console.error("Error al obtener la ubicación:", error);
      });
    } else {
      console.error("La geolocalización no es soportada por este navegador.");
    }
  }
  
  // Llama a la función para iniciar el proceso
  //getLocation();


// let map;
// let center;

// async function initMap() {
//   const { Map } = await google.maps.importLibrary("maps");

//   center = { lat: 37.4161493, lng: -122.0812166 };
//   map = new Map(document.getElementById("map"), {
//     center: center,
//     zoom: 11,
//     mapId: "DEMO_MAP_ID",
//   });
//   findPlaces();
// }



// async function findPlaces(lat, lng) {
//   const { Place } = await google.maps.importLibrary("places");
//   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

//   //Building the request
//   const request = {
//     textQuery: "Tacos",
//     fields: ["displayName", "location", "businessStatus"],
//     includedType: "restaurant",
//     locationBias: { lat: lat, lng: lng },
//     isOpenNow: true,
//     language: "en-US",
//     maxResultCount: 8,
//     minRating: 3.2,
//     region: "us",
//     useStrictTypeFiltering: false,
//   };
//   //get the places list
//   const { places } = await Place.searchByText(request);

//   //If places is not empty, console.log
//   if (places.length) {
//     console.log(places);
//     let placesJson = JSON.parse(JSON.stringify(places))
//     let obj = { placesJson}
//     console.log(obj);

//     const { LatLngBounds } = await google.maps.importLibrary("core");
//     const bounds = new LatLngBounds();

//     // Loop through and get all the results to center the view.
//     places.forEach((place) => {
//       const markerView = new AdvancedMarkerElement({
//         map,
//         position: place.location,
//         title: place.displayName,
//       });

//       bounds.extend(place.location);
//       console.log(place);
//     });
//     map.fitBounds(bounds);
//   } else {
//     console.log("No results");
//   }
// }

// initMap();

let map;

async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  let center = new google.maps.LatLng(52.369358, 4.889258);

  map = new Map(document.getElementById("map"), {
    center: center,
    zoom: 13,
    mapId: "DEMO_MAP_ID",
  });
  nearbySearch();
}

async function nearbySearch() {
  //@ts-ignore
  const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary(
    "places",
  );
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  // Restrict within the map viewport.
  let center = new google.maps.LatLng(userLocation.lat, userLocation.lng);
  const request = {
    // required parameters
    fields: ["displayName", "location", "businessStatus"],
    locationRestriction: {
      center: center,
      radius: 5000,
    },
    // optional parameters
    includedPrimaryTypes: ["restaurant"],
    maxResultCount: 10,
    rankPreference: SearchNearbyRankPreference.POPULARITY,
    language: "en-US",
    region: "us",
  };
  //@ts-ignore
  const { places } = await Place.searchNearby(request);

  if (places.length) {
    console.log(places);

    const { LatLngBounds } = await google.maps.importLibrary("core");
    const bounds = new LatLngBounds();

    // Loop through and get all the results.
    places.forEach((place) => {
      const markerView = new AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName,
      });

      bounds.extend(place.location);
      console.log(place);
    });
    map.fitBounds(bounds);
  } else {
    console.log("No results");
  }
}

//initMap();