import React, { Component } from 'react';
import Register from './Register';
import Login from './Login';

export default class Getin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      userName : '',
      userPass: ''
    }
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
        <div>
          <Register pass={ (a) => this.onLogin(a)}></Register>
          <p className="f-subheader">OR</p>
          <Login pass={ (a) => this.onLogin(a)}></Login>
        </div>
        {
          /* this.state.user 
          ?
          <div>
            <Register pass={ (a) => this.onLogin(a)}></Register>
            <p className="f-subheader">OR</p>
            <Login pass={ (a) => this.onLogin(a)}></Login>
          </div> 
          :
          <div>
            <button onClick={ this.logout }>Log out</button>
          </div> */
        }
      </div>
    );
  }
}