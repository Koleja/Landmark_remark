import React, { Component } from 'react';
import axios from 'axios';

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
    const self = this;

    axios.post('/api/register', {
      userName: self.state.userName,
      userPass: self.state.userPass,
    })
    .then(response => {
      console.log(response)
      this.props.pass(this.state.userName)
    })
    .catch(err => {
      console.error(err)
    });
  }

  render() {
    return (
      <form className="c-form" onSubmit={this.onSubmit}>
        <h1 className="c-form__title">Register</h1>
        <div className="c-form__container">
          <input
            className="c-form__input"
            type="text"
            name="userName"
            placeholder="Enter your nick"
            value={this.state.userName}
            onChange={this.handleInputChange}
            required
          />
          <input
            className="c-form__input"
            type="password"
            name="userPass"
            placeholder="Enter password"
            value={this.state.password}
            onChange={this.handleInputChange}
            required
          />
        </div>
       <input className="c-btn c-btn--green" type="submit" value="Submit"/>
      </form>
    );
  }
}