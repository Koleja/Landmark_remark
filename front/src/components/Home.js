import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
    }
  }
  
  render() {
    return (
      <div className="l-home">
        <h1 className="l-home__title">Landmark Remark</h1>
        <h2 className="f-subheader">To see map and notes you need to sing in.</h2>
        <button className="c-btn c-btn--green"><Link to="/getin">Register or Log in</Link></button>
      </div>
    );
  }
}