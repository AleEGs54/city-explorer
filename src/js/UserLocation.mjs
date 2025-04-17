import { getLocalStorage } from "./localStorageManagement.mjs";

export default class UserLocation {

    /**
   * The constructor checks for a stored location in localStorage.
   * If not found, it uses the BYU-Idaho building as default.
   */
    constructor(enableHighAccuracy = true, timeout = Infinity, maximumAge = 0) {
        const storedLocation = getLocalStorage("lastLocation");
    
        this.location = storedLocation || {
          lat: 43.81463458983826,
          lng: -111.78321208736119,
        };
    
        this.options = {
          enableHighAccuracy: enableHighAccuracy,
          timeout: timeout,
          maximumAge: maximumAge,
        };
      }

    async getLocation() {
        try {
            await this.setLocation();
            return this.location;
        } catch {
            //Returns default location when creating the instance (BYU-I building)
            return this.location
        }
    }

    setLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => this.succesfulCallback(position, resolve),
                    (error) => this.failedcallback(error, reject),
                    this.options
                );
            } else {
                const err = new Error("Geolocation is not supported in this browser.");
                console.error(err.message);
                reject(err);
            }
        });
    }

    succesfulCallback(position, resolve) {
        this.location.lat = position.coords.latitude;
        this.location.lng = position.coords.longitude;
        resolve(this.location);
    }

    failedcallback(error, reject) {
        console.error("Couldn't get the location:", error);
        reject(error);
    }


}

