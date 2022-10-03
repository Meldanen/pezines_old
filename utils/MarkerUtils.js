function createMarker(station, map, infoWindow) {
    var marker = new google.maps.Marker({
      position: getMarkerPosition(station),
      map: map,
      title: station.getName(),
      icon: {
        url: station.getColour()
      }
    });
    setMarkerClickListener(marker, station, map, infoWindow);
    return marker;
}

function getMarkerPosition(station) {
    var latitude = station.getLatitude();
    var longitude = station.getLongitude();
    return new google.maps.LatLng(latitude, longitude);
}

function setMarkerClickListener(marker, station, map, infoWindow) {
    var contentString = getInfoWindowContentString(station);
    marker.addListener("click", () => {
        infoWindow.setContent(contentString);
        infoWindow.open({
        anchor: marker,
        map: map,
        shouldFocus: false,
        });
    });
}

function getInfoWindowContentString(station) {
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

export { createMarker }