import React from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
  } 

  componentDidMount() {}

  componentWillReceiveProps(props) {}

  onMarkerDragEnd = (coord, index) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    this.props.updateLoc({ lat, lng });
    this.setState(prevState => {
      let parkLocLat = lat;
      let parkLocLong = lng;
      return { parkLocLat, parkLocLong };
    });
  };

  render() {
   return (
      <Map
        google={this.props.google}
        style={{
          width: "750px",
          height: "300px"
        }}
        initialCenter={{
          lat: Number(this.props.parkLocLat),
          lng: Number(this.props.parkLocLong)
        }}
        zoom={14}  
      >
        {this.props.parkLocLat && this.props.parkLocLong ? (
          <Marker
            position={{
              lat: Number(this.props.parkLocLat),
              lng: Number(this.props.parkLocLong)
            }}
            draggable={true}
            onDragend={(t, map, coord) => this.onMarkerDragEnd(coord, 0)}
            name={"Mark position"}
          />
        ) : null}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  // apiKey: "AIzaSyARzfNhKk6DEP1aouRi9eS1JrrJ0AGEQFE"
  apiKey: "AIzaSyB6sZTlr7nMV3VqoF0RLrVAL7VB_emNBMo"
})(MapContainer);
