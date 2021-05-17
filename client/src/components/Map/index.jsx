import React, { useState, useRef, useCallback } from 'react'
import {
    GoogleMap,
    // useLoadScript,
    Marker,
    InfoWindow
} from '@react-google-maps/api';
import { features } from '../../utils/dummyData.json';
import './style.scss';
import Search from '../SearchInput'
import FindMeBtn from '../FindMeBtn'
// import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
// import {
//     Combobox,
//     ComboboxInput,
//     ComboboxPopover,
//     ComboboxList,
//     ComboboxOption
// } from "@reach/combobox";
// import "@reach/combobox/styles.css";

import prkingLogo from './images/mapPic.png'
import { useStoreContext } from '../../utils/GlobalState';
// import { UPDATE_MAP_LOCATION } from '../../utils/actions';

const containerStyle = {
    width: '80vw',
    height: '70vh'
};
// const center = { lat: 37.774, lng: -122.419 }
const libraries = ['places'];
const options = {
    disableDefaultUI: true,
    zoomControl: true
}
const plots = features.map(location => (location.geometry.coordinates))

function MyMapComponent() {
    // const { isLoaded, loadError } = useLoadScript({
    //     id: 'google-map-script',
    //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
    //     libraries
    // })

    const [state,] = useStoreContext();
    const [markers, setMarkers] = useState(plots)
    const [map, setMap] = useState(null)
    const [selected, setSelected] = useState(null)
    const mapRef = useRef();

    const onLoad = useCallback((map) => {
        mapRef.current = map;
        setMap(mapRef)
    });

    // if (loadError) {
    //     return "something went wrong"
    // }
    // if (!isLoaded) {
    //     return "loading"
    // }

    return (
        <div className='mapBody'>
            <h1 className='mapTitle'>Parking-Pal <span role='img'>🚗</span></h1>
            <div className='findMeBtn'><FindMeBtn /></div>
            <div className='searchBoxMap'>
                <Search />
            </div>
            <GoogleMap
                key={new Date().getTime()}
                mapContainerStyle={containerStyle}
                zoom={15}
                center={state.mapLocation}
                options={options}
                onLoad={onLoad}
            >
                {markers.map(marker => <Marker
                    icon={{
                        url: prkingLogo,
                        scaledSize: new window.google.maps.Size(40, 40),
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(20, 20)
                    }}
                    key={markers.indexOf(marker)}
                    onClick={() => { setSelected(marker) }}
                    position={{ lat: marker[1], lng: marker[0] }}
                />)}

                {selected ? (
                    <InfoWindow
                        position={{ lat: selected[1], lng: selected[0] }}
                        onCloseClick={() => { setSelected(null) }}
                    >

                        {/* THIS IS THE MAP BUBBLE FILLER */}
                        <div>
                            <h3 style={{ textAlign: 'center' }}>Parking</h3>
                            <p>This is a pretty great spot</p>
                        </div>
                    </InfoWindow>
                ) : null}

            </GoogleMap>
        </div>
    )
}

export default React.memo(MyMapComponent)