import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Land from './components/Map';
import Getin from './components/Getin';
import withAuth from './components/withAuth';

export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/map">Map</Link></li>
            <li><Link to="/getin">Register or Login</Link></li>
          </ul>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/map" component={withAuth(Land)} />
            <Route path="/getin" component={Getin} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}