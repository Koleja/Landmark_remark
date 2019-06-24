import React, { Component } from 'react';
import Register from './register';
import Login from './Login';
import axios from 'axios';

export default class Getin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      userName : '',
      userPass: ''
    }
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

  onLogin = (a) => {
    this.setState({
      user: a
    })
    this.props.getUserName(a)
    this.props.history.push("/map");
  }
  
  render() {
    return (
      <div>
        <Register pass={ (a) => this.onLogin(a)}></Register>
        <Login pass={ (a) => this.onLogin(a)}></Login>
        <div>
          <button onClick={ this.logout }>Log out</button>
        </div>
      </div>
    );
  }
}