import React from 'react';
import {Switch, Route} from 'react-router-dom';
import HomePage from "./pages/homepage/homepage.page";
import 'mapbox-gl/dist/mapbox-gl.css';

class App extends React.Component{
  render(){
    return(
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    )
  }
}

export default App;