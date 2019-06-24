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
      filtered: []
    }
    this.handleMapClick = this.handleMapClick.bind(this);
    this.filterNotes = this.filterNotes.bind(this);
  }

  componentDidMount() {
    this.getDataFromDb()
    this.getLocation()
  }

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
      /* map.panTo(location); */
    }
  }

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
        icon={ note.author==this.props.getUser ? icons.other.icon : icons.user.icon }
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

  filterNotes = (e) => {
    let currentList = [];
    let newList = [];
    const filter = e.target.value.toLowerCase();

    if (e.target.value !== "") {
      currentList = this.state.filtered;

      Object.keys(currentList).map((i) => {
        if (currentList[i].author.toLowerCase().includes(filter) || currentList[i].content.toLowerCase().includes(filter)) {
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
        </div>

        <legend>
          <button>all your notes</button>
          <button>others people notes</button>
        </legend>

        <div>
          <p>{this.props.getUser}</p>
          
          <div>
            <p>Filter thru notes</p>
            <div>
              <button>My notes</button>
              <button>Other notes</button>
              <select>
                <option>user1</option>
                <option>user2</option>
              </select>
              <div>search</div>
            </div>
          </div>

          <div>
            <p>notes list here</p>
            <input type="text" placeholder="Search..." onChange={this.filterNotes} />
            <ul>
              {
                this.state.filtered &&
                Object.keys(this.state.filtered).map((note, i) => (
                  <li key={i}>
                    <p>{ this.state.filtered[i].title }</p>
                    <p>{ this.state.filtered[i].content }</p>
                    <p>{ this.state.filtered[i].author }</p>
                  </li>
              ))
              }
            </ul>
          </div>
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
              <button type="submit" onClick={() => this.putDataToDB(
                this.state.title,
                this.state.content, 
                this.state.position)}>
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