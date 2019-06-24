import React, { Component } from 'react';

export default class Login extends Component {
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

    fetch('/api/authenticate', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        this.props.pass(this.state.userName)
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error logging in please try again');
    });
  }

  render() {
    return (
      <form className="c-form" onSubmit={this.onSubmit}>
        <h1 className="c-form__title">Log in</h1>
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