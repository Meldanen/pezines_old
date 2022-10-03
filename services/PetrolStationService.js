import { Station } from "../beans/Station";
import {getDistance} from 'geolib';
import MarkerColour from "../enums/MarkerColour";

function getPetrolStations(stationsJSON, userLocation, maximumDistanceForNearbyStation, petrolType) {
    var { stations, cheapestInCountry, cheapestNearby } = converToStationObjectsAndFindCheapest(stationsJSON, userLocation, maximumDistanceForNearbyStation);
    checkAndAdjustForMultipleStationsWithCheapestPrice(stations, cheapestInCountry, userLocation, cheapestNearby, maximumDistanceForNearbyStation);
    return stations;
}

function checkAndAdjustForMultipleStationsWithCheapestPrice(stations, cheapestInCountry, userLocation, cheapestNearby, maximumDistanceForNearbyStation) {
    Object.values(stations).forEach(station => {
        if (isCheapestInCountry(cheapestInCountry, station)) {
            stations[station.name].setColour(MarkerColour.PURPLE);
        }
        if (isCheapestNearby(cheapestNearby, station, userLocation, maximumDistanceForNearbyStation)) {
            stations[station.name].setColour(MarkerColour.GREEN);
        }
    });
}

function converToStationObjectsAndFindCheapest(stationsJSON, userLocation, maximumDistanceForNearbyStation) {
    var stations = {};
    var cheapestInCountry = new Station(undefined);
    var cheapestNearby = new Station(undefined);

    stationsJSON.forEach((stationJSON) => {
        var station = new Station(stationJSON);
        if (isCheapestInCountry(cheapestInCountry, station)) {
            cheapestInCountry = station;
        }
        if (isCheapestNearby(cheapestNearby, station, userLocation, maximumDistanceForNearbyStation)) {
            cheapestNearby = station;
        }
        stations[station.name] = station;
    });
    cheapestInCountry.setColour(MarkerColour.PURPLE);
    cheapestNearby.setColour(MarkerColour.GREEN);
    stations[cheapestInCountry.name] = cheapestInCountry;
    stations[cheapestNearby.name] = cheapestNearby;
    return { stations, cheapestInCountry, cheapestNearby };
}

function isCheapestInCountry(cheapestInCountry, station) {
    return cheapestInCountry.getPrice() >= station.getPrice();
}

function isCheapestNearby(cheapestNearby, station, userLocation, maximumDistanceForNearbyStation) {
    return (cheapestNearby.getPrice() >= station.getPrice()) && isCloseEnough(station, userLocation, maximumDistanceForNearbyStation);
}

function isCloseEnough(station, userLocation, maximumDistanceForNearbyStation) {
    var stationPosition = {latitude: station.getLatitude(), longitude: station.getLongitude()};
    const distance = getDistance(stationPosition, userLocation);
    return distance <= maximumDistanceForNearbyStation;
}

export { getPetrolStations };

