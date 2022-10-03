import React from "react";
import StyledMap from "./index.css";
import fsPromises from 'fs/promises';
import path from 'path';
import PetrolType from "../../enums/PetrolType";
import { getPetrolStations } from "../../services/PetrolStationService";

var infoWindow = undefined;


class Map extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.cheapestStation = undefined;
  }

  async componentDidMount() {
    document.body.classList.add("is-map");
    await this.setCurrentLocation();
    this.handleAttachGoogleMap();
    infoWindow = new window.google.maps.InfoWindow({});
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
    const stationsJSON = this.getPetrolJson(PetrolType.UNLEADED_95).stations;
    const stations = getPetrolStations(stationsJSON, this.currentLocation, 10000, PetrolType.UNLEADED_95);
    Object.values(stations).forEach(station => {
      var marker = this.createMarker(station);
      bounds.extend(marker.getPosition());
    });
    this.map.fitBounds(bounds);
    this.map.panToBounds(bounds);
  };

  createMarker(station) {
    var contentString = this.getInfoWindowContentString(station);
    var latitude = station.getLatitude();
    var longitude = station.getLongitude();
    var markerPosition = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
      position: markerPosition,
      map: this.map,
      title: station.getName(),
      icon: {
        url: station.getColour()
      }
    });
    this.setMarkerClickListener(marker, contentString);
    return marker;
  }

  setMarkerClickListener(marker, contentString) {
    marker.addListener("click", () => {
      infoWindow.setContent(contentString);
      infoWindow.open({
        anchor: marker,
        map: this.map,
        shouldFocus: false,
      });
    });
  }

  getInfoWindowContentString(station) {
    var contentString = "";
    contentString += '<div id="info-window-container">';
    contentString += '<div id="info-window-title" class="info-window-title">';
    contentString += "<b>" + station.getName() + "</b>";
    contentString += '</div>';
    contentString += '<div id="info-window-content">';
    contentString += '<p id="info-window-paragraph">';
    contentString += 'Price: ' + station.getPrice();
    contentString += "</br>";
    contentString += 'Address: ' + station.getAddress();
    contentString += '</p>';
    contentString += '<a href="www.google.com">';
    contentString += 'Directions';
    contentString += '</a>';
    contentString += '</div>';
    contentString += '</div>';
    return contentString;
  }

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
    props: {pezines :objectData}
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