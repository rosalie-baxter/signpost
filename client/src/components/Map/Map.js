import React from "react";
import { Link } from "react-router-dom";
import InfoBar from "../InfoBar/InfoBar";
import ServiceInfo from "../ServiceInformation/ServiceInformation";
import { ReactComponent as Close } from "../../assets/close.svg";
import { ReactComponent as Help } from "../../assets/help.svg";
import "./Map.css";

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;
const GOOGLE_GEOCODE_API_KEY = process.env.REACT_APP_GOOGLE_GEOCODE_TOKEN;

// styles
const mapStyles = {
  width: "100%",
  height: "400px"
};
const Map = ({
  selectedService,
  selectedServiceData,
  selectedMarker,
  setSelectedMarker,
  selectedMarkerData,
  setSelectedMarkerData
}) => {
  const [searchLocation, setSearchLocation] = React.useState("");
  const [searchLocationGeocoded, setSearchLocationGeocoded] = React.useState(
    null
  );

  // refs
  const googleMapRef = React.createRef();
  const googleMap = React.useRef(null);
  // helper functions
  const createGoogleMap = () => {
    const map = new window.google.maps.Map(googleMapRef.current, {
      zoom: 14,
      center: {
        lat: 51.5458,
        lng: -0.1043
      }
    });
    map.addListener("click", () => {
      setSelectedMarker(null);
      setSelectedMarkerData(null);
    });
    createMarkers(map);
    return map;
  };
  //function to iterate over the list of services and create a marker for each
  function createMarkers(map) {
    for (var i = 0; i < selectedServiceData.length; i++) {
      const markerImage = {
        url: require(`./pin-icons/${selectedService}.svg`),
        scaledSize: new window.google.maps.Size(48, 48)
      };
      const marker = new window.google.maps.Marker({
        position: {
          lat: Number(selectedServiceData[i].fields.Lat),
          lng: Number(selectedServiceData[i].fields.Lng)
        },
        map: map,
        icon: markerImage,
        animation: window.google.maps.Animation.DROP,
        title: selectedServiceData[i].fields.Name
      });
      marker.addListener("click", function(e) {
        setSelectedMarker(e.tb.target.parentNode.title);
      });
    }
  }
  React.useEffect(() => {
    if (selectedServiceData) {
      const googleMapScript = document.createElement("script");
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
      window.document.body.appendChild(googleMapScript);
      googleMapScript.addEventListener("load", () => {
        googleMap.current = createGoogleMap();
      });
    }
  }, [selectedServiceData]);

  React.useEffect(() => {
    if (selectedMarker) {
      const filteredData = selectedServiceData.filter(
        record => record.fields.Name === selectedMarker
      );
      setSelectedMarkerData(filteredData[0]);
      console.log("I am the filtered data", filteredData[0]);
    }
  }, [selectedMarker]);

  const geocodeSearch = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${searchLocation}&key=${GOOGLE_GEOCODE_API_KEY}&region=GB`
    )
      .then(res => res.json())
      .then(result => {
        //idea: add a message to say the search was invalid
        if (result.status != "ZERO_RESULTS") {
          const lat = result.results[0].geometry.location.lat;
          const lng = result.results[0].geometry.location.lng;
          setSearchLocationGeocoded(new window.google.maps.LatLng(lat, lng));
        }
      });
  };

  //move map centre to search location
  React.useEffect(() => {
    if (googleMap.current) {
      googleMap.current.panTo(searchLocationGeocoded);
    }
  }, [searchLocationGeocoded]);

  //new JS work ends here

  return (
    <>
      <section className='nav-buttons'>
        <Link to='/icons-page'>
          <button className='close-button'>
            <Close />
          </button>
        </Link>
        <Link to='/help'>
          <button className='help-button'>
            <Help />
          </button>
        </Link>
      </section>
      <input
        value={searchLocation}
        type='search'
        onChange={event => setSearchLocation(event.target.value)}
      ></input>
      <button onClick={geocodeSearch}>submit</button>
      <div className='wrapper'>
        <div id='google-map' ref={googleMapRef} style={mapStyles} />
        <div className='over-map'>
          {selectedMarkerData ? (
            <Link to='/service'>
              <InfoBar
                name={selectedMarkerData.fields.Name}
                description={selectedMarkerData.fields.Description}
                address={selectedMarkerData.fields.Address}
                timings={selectedMarkerData.fields.Opening}
              />
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Map;
