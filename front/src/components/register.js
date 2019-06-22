import React, { Component } from 'react';
import axios from "axios";

export default class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName : '',
      userPass: ''
    };
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    
    /* fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        this.props.history.push('/');
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error registering, please try again');
    }); */

    const self = this;

    axios.post('/api/register', {
      userName: self.state.userName,
      userPass: self.state.userPass,
    })
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.error(err)
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Register Below!</h1>
        <input
          type="text"
          name="userName"
          placeholder="Enter your nick"
          value={this.state.userName}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="password"
          name="userPass"
          placeholder="Enter password"
          value={this.state.password}
          onChange={this.handleInputChange}
          required
        />
       <input type="submit" value="Submit"/>
      </form>
    );
  }
}