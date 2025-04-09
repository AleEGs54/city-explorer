export default class UserLocation {

    /** 
    *The constructor takes the BYU-Idaho building as default (maybe the user doesn't want to share his location). Or can take customized latLng values; if not, it will try to get the user's real location.
    */
    constructor(latitude = 43.81463458983826, longitude = -111.78321208736119, enableHighAccuracy = true, timeout = Infinity, maximumAge = 0) {

        this.location = {
            lat: latitude,
            lng: longitude
        }

        this.options = {
            enableHighAccuracy: enableHighAccuracy,
            timeout: timeout,
            maximumAge: maximumAge
        }
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

//como usar el resolve en la clase (no se esta usando)
