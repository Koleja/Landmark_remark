import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import axios from 'axios';
//import Map from './Map';
require('dotenv').config();

export class Land extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      showModal: false,
      lat: '',
      lng: '',
      locations: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      currentUser: ''
    }
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  componentDidMount() {
    this.getDataFromDb()
    this.getLocation()
  }

  getDataFromDb = () => {
    const self = this
    fetch('/api/getData')
      .then(data => data.json())
      .then(res => {
        this.setState({ data: res.data })
      })
  }

  putDataToDB(t, c, p, a) {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    const self = this

    axios.post("/api/putData", {
      id: idToBeAdded,
      title: t,
      content: c,
      position: p,
      author: a
    })
    .then(response => {
      console.log(response)
      self.setState({
        showModal: false
      })
      self.getDataFromDb()
    })
    .catch(err => {
      console.log(err)
    });
  }

  getLocation() {
    const self = this;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

        self.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        console.log('geolocation found: '+self.state.lat+' '+self.state.lng)
      })
    } else {
      // Browser doesn't support Geolocation
      console.log('geolocation not supported')
    }
  }

  handleMapClick = (mapProps, map, e) => {
    const location = e.latLng;

    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    })

    let accept = window.confirm('Do you want to add new note?')
    if (accept) {
      this.setState({
        showModal: true,
        position: location
      })
      this.setState(prevState => ({
        locations: [...prevState.locations, location]
      }));

      /* 
      map.panTo(location); */
    }
  }

  displayMarkers() {
    
    return this.state.data.map((note, index) => {
      return <Marker 
        key={index} 
        id={index} 
        position={{
          lat: note.position.lat,
          lng: note.position.lng
        }}
        title={ note.title }
        author={ note.author }
        content={ note.content }
        onClick={ this.handleMarkerClicked } />
    })
  }

  handleMarkerClicked = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
    console.log(marker)
  }

    

  fetchPlaces(mapProps, map) {
    const {google} = mapProps;
    const service = new google.maps.places.PlacesService(map);
    // ...
  }

  

  onSubmit(e) {
    e.preventDefault();
    
  }

  render() {
    const style = {
      width: '100%',
      height: '100%'
    }
    const icons = {
      main: {
        icon: require('../assets/location-pointer--red.png')
      },
      user: {
        icon: require('../assets/location-pointer--green.png')
      },
      other: {
        icon: require('../assets/location-pointer--purple.png')
      }
    };
    if (!this.props.loaded) {
      return <div>Loading...</div>
    }
    return (
      <div className="c-land">
        <div className="c-land__map">
          <Map
            google={this.props.google}
            zoom={10}
            style={style}
            initialCenter={{ lat: this.state.lat, lng: this.state.lng }}
            center={{ lat: this.state.lat, lng: this.state.lng }}
            onClick={ this.handleMapClick }
            onReady={this.fetchPlaces}
          >
            <Marker 
              position={{ lat: this.state.lat, lng: this.state.lng }} 
              title="Your current position"
              author="You" 
              icon={icons.main.icon}
              onClick={this.handleMapClick}
            />

            
            {
              this.state.data &&
              this.displayMarkers()
            }

            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
                <div>
                  <h2>{this.state.selectedPlace.title}</h2>
                  <h3>{this.state.selectedPlace.content}</h3>
                  <p>by {this.state.selectedPlace.author}</p>
                </div>
            </InfoWindow>

            
            {/* <div>{
              this.state.data &&
              this.state.data.map((note, i) => {
                console.log(note.position.lat)
                return (
                  <Marker
                    key={i}
                    position={{ lat: note.position.lat, lng: note.position.lng }}
                  />
                );
              })
            }</div> */}

            
          </Map>
        </div>

        <div>
          <p>{this.props.getUser}</p>
            <ul>
            {
              this.state.data &&
              Object.keys(this.state.data).map((note, i) => (
                //<p key={i}>{keyName}: {this.state.weatherData[keyName]}</p>

                <li key={i}>
                  <p>{ this.state.data[i].title }</p>
                  <p>{ this.state.data[i].content }</p>
                  <p>{ this.state.data[i].author }</p>
                </li>
            ))
            }
            </ul>
        </div>
        
        {
          this.state.showModal && 
          <div className="c-modal">
            <form onSubmit={this.onSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Type a title"
                onChange={e => this.setState({ title: e.target.value })}
              ></input>
              <textarea 
                placeholder="Type a note"
                name="note"
                onChange={e => this.setState({ content: e.target.value })}>  
              </textarea>
              <input 
                type="text"
                name="author"
                placeholder="Sign"
                onChange={e => this.setState({ author: e.target.value})}
              ></input>
              <button type="submit" onClick={() => this.putDataToDB(
                this.state.title,
                this.state.content, 
                this.state.position, 
                this.state.author)}>
                ADD
              </button>
            </form>
          </div>
        }
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_MAP_KEY)
})(Land)