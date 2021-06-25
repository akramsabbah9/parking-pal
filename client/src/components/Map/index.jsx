import React, { useState, useEffect } from 'react';
import './style.scss';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import Search from '../SearchInput';
import FindMeBtn from '../FindMeBtn';
import prkingLogo from './images/mapPic.png';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_MAP_LOCATION, UPDATE_SELECTED_INVENTORY } from '../../utils/actions';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { QUERY_ALL_PARKING } from "../../utils/queries";
import { Link } from "react-router-dom";


const containerStyle = {
    width: '85vw',
    height: '65vh'
};
const options = {
    disableDefaultUI: true,
    zoomControl: true
}


function MyMapComponent(props) {
    const [state, dispatch] = useStoreContext();
    const [markers, setMarkers] = useState([]);

    // execute query with polling, to re-query the map every 5 minutes
    // TODO: stop polling from resetting map position every time it refetches
    // TODO: maybe use fetchMore instead of polling, to get updates

    /* Although fetchMore is often used for pagination, there are many other cases in which it is applicable.
        For example, suppose you have a list of items (say, a collaborative todo list) and you have a way to fetch
        items that have been updated after a certain time. Then, you don't have to refetch the whole todo list to
        get updates: you can just incorporate the newly added items with fetchMore, as long as your updateQuery
        function correctly merges the new results.
    */

    const { loading, error, data, refetch } = useQuery(QUERY_ALL_PARKING, {
        pollInterval: 300000, // 5* 1000 * 60,
        // TODO: instead of using variables, we can filter the data itself
        // variables: { city: state.mapCity, startDate: state.mapDate }
        variables: { startDate: state.mapDate } // we only search by city to move the map to that city
    });
    
    if (loading) {
        // console.log('loading');
    }

    if (error) {
        console.error(error);
    }

    useEffect(() => {
        if (data) {
            // console.log(data);
            setMarkers(data.getAllInventories);
        }
    }, [data]);

    // console.log(state.mapCity, state.mapDate);
    // console.log(state.selectedInventory);

    // THIS MAPS OVER THE MARKERS THAT !!SHOULD!! BE RENDERED
    // markers && markers.map(marker => marker.parkingPlace && console.log(marker))

    return (
        <div className='mapBody'>
            <h1 className='mapTitle'>Parking-Pal <span role='img'>🚗</span></h1>

            {props.findMeBtn ? <div className='findMeBtn'><FindMeBtn /></div> : null}

            {props.searchBar ? <div className='searchBoxMap'><Search /></div> : null}

            <GoogleMap
                key={new Date().getTime()}
                mapContainerStyle={containerStyle}
                zoom={15}
                center={state.mapLocation ? state.mapLocation : { lat: 37.774, lng: -122.419 }}
                options={options}
            >
                {markers ?
                    (markers.map(marker => marker.parkingPlace && <Marker

                        icon={{
                            url: prkingLogo,
                            scaledSize: new window.google.maps.Size(40, 40),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(20, 20)
                        }}
                        key={markers.indexOf(marker)}
                        onClick={() => {
                            dispatch({
                                type: UPDATE_SELECTED_INVENTORY,
                                selectedInventory: marker
                            });
                            dispatch({
                                type: UPDATE_MAP_LOCATION,
                                location: { lat: parseFloat(marker.parkingPlace.latLng[0]), lng: parseFloat(marker.parkingPlace.latLng[1]) }
                            })
                        }}
                        position={{ lat: parseFloat(marker.parkingPlace.latLng[0]), lng: parseFloat(marker.parkingPlace.latLng[1]) }}
                        id={markers.indexOf(marker)}
                    />)) : null}

                {state.selectedInventory ? (
                    <InfoWindow
                        position={{ lat: parseFloat(state.selectedInventory.parkingPlace.latLng[0]), lng: parseFloat(state.selectedInventory.parkingPlace.latLng[1]) }}
                        onCloseClick={() => {
                            dispatch({
                                type: UPDATE_SELECTED_INVENTORY,
                                selectedInventory: null
                            });
                        }}
                    >
                        <div className='mapInfoWindow'>
                            <h3 style={{ textAlign: 'center' }}>${state.selectedInventory.price}/day</h3>
                            <p>{state.selectedInventory.parkingPlace.street}, {state.selectedInventory.parkingPlace.city}<br />
                                {state.selectedInventory.parkingPlace.isCoveredParking ? 'Indoor Parking' : 'Outdoor Parking'}</p>
                            <Link to='checkout'>
                                <button style={{ textAlign: 'center' }}>Reserve</button>
                            </Link>
                        </div>
                    </InfoWindow>
                ) : null}

            </GoogleMap>
        </div>
    );
}

export default React.memo(MyMapComponent);