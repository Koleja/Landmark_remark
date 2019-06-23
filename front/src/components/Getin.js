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

    //this.onLogin = this.onLogin.bind(this)
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
    console.log('its from getin component: '+a)
    this.setState({
      user: a
    })

    const id = this.refs.userNick
    console.log(id)
    /* this.setState({
      user: a
    })
    this.props.passUser(this.state.user) */
    //this.props.passUser(a)
    this.props.history.push("/map");
  }

  /* handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  // register part
  onRegister = (event) => {
    event.preventDefault();

    const self = this;

    axios.post('/api/register', {
      userName: self.state.userNameReg,
      userPass: self.state.userPassReg,
    })
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.error(err)
    });
  }

  //login part
  onSubmit = (event) => {
    event.preventDefault();
    const self = this

    axios.post('/api/authenticate', {
      userName: self.state.userNameLog,
      userPass: self.state.userPassLog,
    })
    .then(res => {
      if (res.status === 200) {
        console.log(this.state.userNameLog);
        this.props.nick(this.state.userNameLog)
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error logging in please try again');
    });
  } */


  
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

    /* return (
      <div>
        <div>
          <p>register</p>
          <form onSubmit={this.onRegister}>
            <h1>Register Below!</h1>
            <input
              type="text"
              name="userNameReg"
              placeholder="Enter your nick"
              value={this.state.userNameReg}
              onChange={this.handleInputChange}
              required
            />
            <input
              type="password"
              name="userPassReg"
              placeholder="Enter password"
              value={this.state.passwordReg}
              onChange={this.handleInputChange}
              required
            />
          <input type="submit" value="Submit"/>
          </form>
        </div>

        <div>
          <p>login</p>
          <form onSubmit={this.onSubmit}>
            <h1>Login Below!</h1>
            <input
              type="text"
              name="userNameLog"
              placeholder="Enter your nick"
              value={this.state.userNameLog}
              onChange={this.handleInputChange}
              required
            />
            <input
              type="password"
              name="userPassLog"
              placeholder="Enter password"
              value={this.state.passwordLog}
              onChange={this.handleInputChange}
              required
            />
          <input type="submit" value="Submit"/>
          </form>
        </div>

        <div>
          <button onClick={ this.logout }>Log out</button>
        </div>
      </div>
    ) */
  }
}