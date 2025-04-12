import { buildInfoWindowCard } from "./userInterface.mjs";

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
        const { Map } = await google.maps.importLibrary("maps");


        // The map, centered at user's location
        this.map = new Map(document.getElementById("map"), {
            zoom: 15,
            center: this.location,
            mapId: 'DEMO_MAP_ID',
        });

        //Link to the autocomplete search bar
        this.runPlaceAutocomplete(this.map);
    }

    /**
     * Shows the location of all places requested by the param 'place'
     * @param place: Array of Objects containing information about a place.
     * @param content: If not given, the place's name will be used
     * @param open: Specifies if the infoWindow should be open when looking for a place.
     */
    async buildAdvancedMarker(place, content = null, open = false) {
        //Get the libraries
        const { InfoWindow } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

        const infoWindow = new InfoWindow()

        //The marker's modifiers
        const mod = new PinElement({
            background: place.iconBackgroundColor,
            glyph: new URL(String(place.svgIconMaskURI)),
        });

        // The marker, positioned at user's location
        const marker = new AdvancedMarkerElement({
            map: this.map,
            position: place.location,
            title: place.displayName,
            content: mod.element,
            gmpClickable: true,
        });

        //Event listener when the marker is clicked
        marker.addListener('click', ({ event, latLng }) => {
            infoWindow.close();
            infoWindow.setContent(
                content ? content : marker.title
            );
            infoWindow.open(marker.map, marker);
        });

        if (open) {
            marker.click();
        }

    }

    /**
     * Makes a nearby search within a radius of 1500 meters. Receives an array with the included Primary Types to filter the search.
     * @param includedPrimaryTypes: Array.
    */
    async nearbySearch(primaryTypesList) {
        //Importing libaries I need.
        const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places');


        //Specify the details of the request
        const request = {
            //required parameter
            fields: ['displayName', 'photos', 'rating', 'userRatingCount', 'reviews', 'priceLevel', 'primaryType', 'location', 'types', 'svgIconMaskURI', 'iconBackgroundColor'],
            locationRestriction: {
                center: this.location,
                radius: 1500,
            },
            //optional parameters
            includedPrimaryTypes: primaryTypesList,
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

                //Builds markers for each place and adds an icon to it.
                this.buildAdvancedMarker(place);

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

    async runPlaceAutocomplete(map) {
        await google.maps.importLibrary("places");

        //create a placeAutocomplete instance
        const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();

        //give it an id and location bias
        placeAutocomplete.id = 'search-bar';
        //placeAutocomplete.locationBias = center;

        //put the input (place autocomplete) inside the container.
        const container = document.querySelector('.search-section');
        container.appendChild(placeAutocomplete);

        // Add the gmp-placeselect listener, and display the results on the map.
        placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
            const place = placePrediction.toPlace();
            await place.fetchFields({ fields: ['displayName', 'rating', 'userRatingCount', 'priceLevel', 'primaryType', 'location', 'types', 'svgIconMaskURI', 'iconBackgroundColor', 'formattedAddress'] });
            // If the place has a geometry, then present it on a map.
            if (place.viewport) {
                map.fitBounds(place.viewport);
            }
            else {
                map.setCenter(place.location);
                map.setZoom(17);
            }

            let content = buildInfoWindowCard(place);

            //Build the marker for the place selected
            this.buildAdvancedMarker(place, content, open=true);
        });

    }
}