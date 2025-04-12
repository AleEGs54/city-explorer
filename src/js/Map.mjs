export default class Map {
    constructor(userLocation, apiKey) {
        this.location = userLocation
        this.apiKey = apiKey
        this.map;
        this.data = [];
    }

    init() {
        this.getGoogleMapsApi();
        // this.initMap();
        // this.buildAdvancedMarker();
        // this.nearbySearch();
    }

    async getGoogleMapsApi() {

        (g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })({
            key: `${this.apiKey}`,
            v: "weekly",

        });
    }

    /**
     * Initializes the map
    */
    async initMap() {
        // Request needed libraries.
        const { Map, InfoWindow } = await google.maps.importLibrary("maps");


        // The map, centered at user's location
        this.map = new Map(document.getElementById("map"), {
            zoom: 15,
            center: this.location,
            mapId: 'DEMO_MAP_ID',
        });

        //The info window
        const infoWindow = new InfoWindow();



    }

    /**
     * Shows ur location, that's all
     */
    async buildAdvancedMarker() {
        //Get the libraries
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

        //The marker's mod
        const mod = new PinElement({
            borderColor: "#fff",
            scale: 1.5,
            glyph: "Me",
            glyphColor: '#fff'
        });

        // The marker, positioned at user's location
        const marker = new AdvancedMarkerElement({
            map: this.map,
            position: this.location,
            title: "Your location",
            content: mod.element,
            gmpClickable: true,
        });

        //Event listener when the marker is clicked
        marker.addListener('click', ({ event, latLng }) => {
            infoWindow.close();
            infoWindow.setContent(marker.title);
            infoWindow.open(marker.map, marker);
        })

    }

    /**
     * Makes a nearby search with the default values.
    */
    async nearbySearch() {
        //Importing libaries I need.
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places');


        //Specify the details of the request
        const request = {
            //required parameter
            fields: ['displayName', 'photos', 'rating', 'userRatingCount', 'reviews', 'priceLevel', 'primaryType', 'location', 'types'],
            locationRestriction: {
                center: this.location,
                radius: 1500,
            },
            //optional parameters
            includedPrimaryTypes: ['restaurant', 'movie_theater', 'park', 'shopping_mall'],
            maxResultCount: 10,
            rankPreference: SearchNearbyRankPreference.POPULARITY,
            language: 'en',
            region: 'us',
        }

        const { places } = await Place.searchNearby(request);

        if (places.length) {
            //get latlngbound library/class
            const { LatLngBounds } = await google.maps.importLibrary('core');
            const bounds = new LatLngBounds();

            //Fill data with places information.
            this.data = places;

            //Loop through and get all the results.
            places.forEach((place) => {
                const markerView = new AdvancedMarkerElement({
                    map: this.map,
                    position: place.location,
                    title: place.displayName,
                });

                //Extend the search to the places searchNearby found (otherwise these wont show up in the map)
                bounds.extend(place.location);
            })

            //After the loop has finished and all the places have been added to the bounds, this line tells the map to adjust its view so that all the places are visible on the map.
            this.map.fitBounds(bounds)

        } else {
            console.log('No Results Found');
        }

    }


    get gatheredData() {
        return this.data;
    }

    /**
     * Returns the city name based on the user's location (if given). Or, from Rexburg, ID. Uses the Nominatim API (OpenStreetMap).
     */
    async getCityFromCoordinates() {

        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.location.lat}&lon=${this.location.lng}`;
      
        const response = await fetch(url);
        const data = await response.json();
        
        
        try {

            return data.address.city;
            
        } catch {
          throw new Error("Geocoding failed: " + data);
        }
      }
}