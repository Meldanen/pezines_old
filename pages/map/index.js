import React from "react";
import StyledMap from "./index.css";
import fsPromises from 'fs/promises';
import path from 'path';
import PetrolType from "../../enums/PetrolType";
import { getPetrolStations } from "../../services/PetrolStationService";
import { createMarker } from "../../utils/MarkerUtils";

var infoWindow = undefined;


class Map extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.cheapestStation = undefined;
    this.maximumDistanceForNearbyStation = 10000; // metres
    
  }

  async componentDidMount() {
    document.body.classList.add("is-map");
    this.infoWindow = new window.google.maps.InfoWindow({});
    await this.setCurrentLocation();
    this.handleAttachGoogleMap();
  }
  componentWillUnmount() {
    document.body.classList.remove("is-map");
  }

  async setCurrentLocation() {
    this.currentLocation = await locateCurrentPosition().then(position => ({latitude: position.coords.latitude, longitude: position.coords.longitude}) );
  }

  handleAttachGoogleMap = async () => {
    const defaultCenter = this.currentLocation;
    this.map = new window.google.maps.Map(document.getElementById("google-map"), {
      center: {lat: defaultCenter.latitude, lng: defaultCenter.longitude},
      zoom: 10,
    });
    this.map.setClickableIcons(true)
    this.handleDrawMarkers();
    // setTimeout(() => {
    //     this.handleDrawMarkers();
    //   }, 1000);
    
  };

  getPetrolJson(petrolType) {
    return this.props.pezines[petrolType];
  }

  handleDrawMarkers = async () => {
    const bounds = new google.maps.LatLngBounds();
    const petrolType = PetrolType.UNLEADED_95;
    const stationsJSON = this.getPetrolJson(petrolType).stations;
    const stations = getPetrolStations(stationsJSON, this.currentLocation, this.maximumDistanceForNearbyStation, petrolType);
    Object.values(stations).forEach(station => {
      var marker = createMarker(station, this.map, this.infoWindow)
      bounds.extend(marker.getPosition());
    });
    this.map.fitBounds(bounds);
    this.map.panToBounds(bounds);
  };

  render() {
    return (
      <StyledMap>
        <div id="google-map" />
      </StyledMap>
    );
  }
}



Map.propTypes = {
  // prop: PropTypes.string.isRequired,
};


export async function getStaticProps() {
  const folderPath = process.cwd() + "\\assets\\data\\";
  const filePath = path.join(folderPath, 'data.json');
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData);

  return {
    props: {pezines: objectData}
  }
}

export const locateCurrentPosition = () => new Promise((resolve,reject)=> {
  navigator.geolocation.getCurrentPosition(
    position => {
      resolve(position);
    },
    error => {
      console.log(error.message);
      reject(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000
    }
  );
});

export default Map;