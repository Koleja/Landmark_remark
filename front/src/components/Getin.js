import React, { Component } from 'react';
import Register from './register';
import Login from './Login';
import axios from 'axios';

export default class Getin extends Component {
  constructor() {
    super();
    this.state = {
    }
  }
  
  componentDidMount() {
    
  }

  logout() {

    axios.post('/logout')
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.error(err)
    });
  }


  
  render() {
    return (
      <div>
        <Register></Register>
        <Login></Login>
        <div>
          <button onClick={ this.logout }>Log out</button>
        </div>
      </div>
    );
  }
}