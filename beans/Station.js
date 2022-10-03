import MarkerColour from "../enums/MarkerColour";

export class Station {
    constructor(station) {     
        this.name = station == undefined ? "N/A" : station.name;
        this.location = station == undefined ? "N/A" : station.location;
        this.price = station == undefined ? Number.POSITIVE_INFINITY : station.price; // :)
        this.setColour(MarkerColour.RED);
    }

    getName() {
        return this.name;
    }

    getPrice() {
        return this.price;
    }

    getAddress() {
        return this.location.address;
    }

    getCoordinates() {
        return this.location.address;
    }

    getLatitude() {
        return this.location.coordinates.latitude;
    }

    getLongitude() {
        return this.location.coordinates.longitude;
    }

    getLongitude() {
        return this.location.coordinates.longitude;
    }

    setColour(markerColour) {
        this.colour = markerColour;
    }

    getColour() {
        return this.colour;
    }

  }