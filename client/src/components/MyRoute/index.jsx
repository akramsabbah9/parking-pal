import React from "react";
import { Route } from "react-router-dom";

function MyRoute(props) {
    if (props.title) document.title = `Parking-Pal | ${props.title}`;

    return <Route { ...props } />;
}

export default MyRoute;
