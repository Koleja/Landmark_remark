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

  putDataToDB(c, p, a) {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    const self = this

    axios.post("/api/putData", {
      id: idToBeAdded,
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
              content="Your current position" 
              onClick={this.handleMarkerClicked}
            />

            
            {
              this.state.data &&
              this.displayMarkers()
            }

            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
                <div>
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
            {/* <ul>
            {this.state.data.length <= 0
              ? "NO DB ENTRIES YET"
              : this.state.data.map(dat => (
                <li style={{ padding: "10px" }} key={dat._id}>
                  <p style={{ color: "gray" }}> question: {dat.content} </p>
                  <p style={{ color: "gray" }}> good answer: {dat.position} </p>
                  <p style={{ color: "gray" }}> incorrect answers: {dat.author} </p>
                </li>
              ))}
            </ul> */}
        </div>
        
        {
          this.state.showModal && 
          <div className="c-modal">
            <form onSubmit={this.onSubmit}>
              <textarea 
                placeholder="Type a note"
                name="note"
                onChange={e => this.setState({ content: e.target.value })}>  
              </textarea>
              <input 
                type="text"
                onChange={ e => this.setState({ author: e.target.value})}
              ></input>
              <button type="submit" onClick={() => this.putDataToDB(
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