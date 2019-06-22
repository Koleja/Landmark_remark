import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
require('dotenv').config();

export class Land extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Loading...'
    }
  }

  componentDidMount() {
    fetch('/api/secret')
      .then(res => res.text())
      .then(res => this.setState({message: res}));
  }

  render() {
    return (
      <div>
        <h1>Map</h1>
        <p>{this.state.message}</p>
        <Map
          google={this.props.google}
          zoom={8}
          initialCenter={{ lat: 47.444, lng: -122.176}}
        />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_MAP_KEY)
})(Land)