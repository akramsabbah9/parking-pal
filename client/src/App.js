import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import {
  BrowserRouter as Router,
  // Route,
  Switch,
} from "react-router-dom";
import { StoreProvider } from "./utils/GlobalState";

import MyRoute from "./components/MyRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
// import History from "./pages/History";
import NoMatch from "./pages/NoMatch";
import Checkout from "./pages/Checkout";
import SuccessfulReservation from "./pages/SuccessfulReservation";
import FindASpot from "./pages/FindASpot";
import AddASpot from "./pages/AddASpot";
import MySpots from "./pages/MySpots";

const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem("id_token");

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  uri: "/graphql",
});

function App() {

  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <StoreProvider>
            <Switch>
              <MyRoute exact path="/" component={Home} title="Home"></MyRoute>

              <MyRoute exact path="/dashboard" component={Dashboard} title="User Dashboard"></MyRoute>

              <MyRoute exact path="/addparking" component={AddASpot} title="Add a Spot"></MyRoute>

              <MyRoute exact path="/myspots" component={MySpots} title="My Spots"></MyRoute>

              {/* <MyRoute exact path="/history" component={History} title="History">
                {!Auth.loggedIn() ? <Redirect to="/" /> : null}
              </MyRoute> */}

              <MyRoute exact path="/checkout" component={Checkout} title="Checkout"></MyRoute>

              <MyRoute exact path="/success" component={SuccessfulReservation} title="Reservation Success"></MyRoute>

              <MyRoute exact path="/findparking" component={FindASpot} title="Find Parking"></MyRoute>

              <MyRoute component={NoMatch} title="No Match" />
            </Switch>
          </StoreProvider>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
