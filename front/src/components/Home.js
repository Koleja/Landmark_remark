import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Loading...'
    }
  }
  
  componentDidMount() {
  }
  
  render() {
    return (
      <div>
        <h1>Landmark remark</h1>
        <h2>To see map and notes you need to sing in.</h2>
        <button><Link to="/getin">Register or Login</Link></button>
      </div>
    );
  }
}