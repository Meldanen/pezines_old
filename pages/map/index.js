import React from "react";
import StyledMap from "./index.css";
// Fetching data from the JSON file
// import { promises as fs } from 'fs';
// import path from 'path'
// Fetching data from the JSON file
import fsPromises from 'fs/promises';
import path from 'path';

class Map extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }
    state = {
        defaultCenter: {
          lat: 35.158301780673504,
          lng: 33.36125104581479,
        },
        markers: [
          {
            lat: 35.158301780673504,
            lng: 33.36125104581479,
          },
          {
            lat: 35.16688796539,
            lng: 33.36125104581479,
            key: "aaa",
          },
        ],
      };

  componentDidMount() {
    document.body.classList.add("is-map");
    this.handleAttachGoogleMap();
  }
  componentWillUnmount() {
    document.body.classList.remove("is-map");
  }

  handleAttachGoogleMap = () => {
    const { defaultCenter } = this.state;
    this.map = new google.maps.Map(document.getElementById("google-map"), {
      center: defaultCenter,
      zoom: 10,
    });
    this.handleDrawMarkers();
    // setTimeout(() => {
    //     this.handleDrawMarkers();
    //   }, 1000);
    
  };

  handleDrawMarkers = () => {
    const { markers } = this.state;
    const bounds = new google.maps.LatLngBounds();
    // console.log(this.props);
    const beeps = this.props.pezines[0].stations;
    // console.log(this.props.lel[0].stations)
  
    beeps.forEach((beep) => {

      
      var infoWindow = new google.maps.InfoWindow({
          content: "asdas"
      });

      var lato = beep.location.coordinates.latitude
      var longo = beep.location.coordinates.longitude
      console.log(lato)
      console.log(longo)
      var bounderinos = {lat : lato, lng :longo}

      var markerino = new google.maps.Marker({
        position: bounderinos,
        map: this.map,
        title: "aaaa",
        infoWindow: infoWindow,
      })
  
      bounds.extend(bounderinos);
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
  console.log(process.cwd())
  const folderPath = process.cwd() + "\\assets\\data\\";
  const filePath = path.join(folderPath, 'data.json');
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData);

  return {
    props: {pezines :objectData}
  }
}

export default Map;