import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import axios from 'axios';
require('dotenv').config();

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
      currentUser: '',
      filtered: [],
    }
    this.handleMapClick = this.handleMapClick.bind(this);
    this.filterNotes = this.filterNotes.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.refMap = React.createRef();
  }

  componentDidMount() {
    this.getDataFromDb()
    this.getLocation()
  }

  // fetch notes from db
  getDataFromDb = () => {
    fetch('/api/getData')
      .then(data => data.json())
      .then(res => {
        this.setState({ 
          data: res.data,
          filtered: res.data
        })
      })
  }

  // save note to db
  putDataToDB(t, c, p) {
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
      author: self.props.getUser
    })
    .then(response => {
      self.setState({
        showModal: false
      })
      self.getDataFromDb()
    })
    .catch(err => {
      console.log(err)
    });
  }

  // get current location of device and create marker
  getLocation() {
    const self = this;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        self.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      })
    } else {
      // Browser doesn't support Geolocation
      console.log('geolocation not supported')
    }
  }

  // on map click show modal to create new note and marker on the map
  handleMapClick = (mapProps, map, e) => {
    const location = e.latLng;

    this.setState({
      showingInfoWindow: false,
      activeMarker: null,
      filtered: this.state.data
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
      /* map.panTo(location); */
    }
  }

  // create all markers for notes fetched from db
  displayMarkers(notes) {
    return notes.map((note, index) => {
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
        icon={ note.author === this.props.getUser ? icons.other.icon : icons.user.icon }
        onClick={ this.handleMarkerClicked } />
    })
  }

  // on clicked marker show its info window
  handleMarkerClicked = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  // on picked note scroll to map and display note's marker
  showMarker = (pickedNote) => {
    this.setState({
      filtered: [pickedNote],
      showingInfoWindow: false
    })
    this.scroll(this.refMap)
  }

  // reset list of markers to initial 
  returnData = () => {
    const startList = this.state.data
    this.setState({
      filtered: startList
    })
  }

  // filter notes by phrase from input and update markers on the map by search results
  filterNotes = (e) => {
    let currentList = [];
    let newList = [];
    const filter = e.target.value.toLowerCase();

    if (e.target.value !== "") {
      currentList = this.state.filtered;

      Object.keys(currentList).map((i) => {
        if (currentList[i].author.toLowerCase().includes(filter) || currentList[i].title.toLowerCase().includes(filter) || currentList[i].content.toLowerCase().includes(filter)) {
          newList.push(currentList[i])
        }
      })
    } else {
      newList = this.state.data
    }

    this.setState({
      filtered: newList
    })
  }

  closeModal() {
    this.setState({
      showModal: false
    })
  }

  scroll(ref) {
    ref.current.scrollIntoView({behavior: 'smooth'})
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
      <div className="c-land" ref={this.refMap}>
        <div className="c-land__map">
          <Map
            google={this.props.google}
            zoom={10}
            style={style}
            initialCenter={{ lat: this.state.lat, lng: this.state.lng }}
            center={{ lat: this.state.lat, lng: this.state.lng }}
            onClick={ this.handleMapClick }
          >
            <Marker 
              position={{ lat: this.state.lat, lng: this.state.lng }} 
              icon={icons.main.icon}
              onClick={this.handleMapClick}
            />
            {
              this.state.data &&
              this.displayMarkers(this.state.filtered)
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
          </Map>
          {
            this.state.showModal && 
            <div className="c-modal">
              <button className="c-modal__close c-btn c-btn--blue" onClick={this.closeModal}>X</button>
              <form className="c-form" onSubmit={this.onSubmit}>
                <input
                  className="c-form__input"
                  type="text"
                  name="title"
                  placeholder="Type a title"
                  onChange={e => this.setState({ title: e.target.value })}
                ></input>
                <textarea 
                  className="c-form__input"
                  placeholder="Type a note"
                  name="note"
                  onChange={e => this.setState({ content: e.target.value })}>  
                </textarea>
                <button className="c-btn c-btn--green" type="submit" onClick={() => this.putDataToDB(
                  this.state.title,
                  this.state.content, 
                  this.state.position)}>
                  Add
                </button>
              </form>
            </div>
          }
        </div>

        <legend className="c-legend">
          <p className="c-legend__item c-legend__item--here">You are here</p>
          <p className="c-legend__item c-legend__item--userNotes">That's your note</p>
          <p className="c-legend__item c-legend__item--others">Others people's notes</p>
        </legend>

        <div>
          <div className="c-land__container">
            <p>Find the note!</p>
            <input className="c-form__input" type="text" placeholder="Search for note..." onChange={this.filterNotes} onFocus={this.returnData} />
            <ul className="c-notes">
              {
                this.state.filtered &&
                Object.keys(this.state.filtered).map((note, i) => (
                  <li className="c-note" key={i} onClick={(e) => this.showMarker(this.state.filtered[i])}>
                    <p className="c-note__item c-note__item--title">{ this.state.filtered[i].title }</p>
                    <p className="c-note__item">{ this.state.filtered[i].content }</p>
                    <p className="c-note__item c-note__item--author">by { this.state.filtered[i].author }</p>
                  </li>
              ))
              }
            </ul>
          </div>
        </div>
        
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_MAP_KEY)
})(Land)