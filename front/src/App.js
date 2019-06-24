import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import './styles/App.scss';
import Home from './components/Home';
import Land from './components/Land';
import Getin from './components/Getin';
import withAuth from './components/withAuth';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      nick: '',
      logged: true
    }
    this.logout = this.logout.bind(this)
  }

  getUserName = (nick) => {
    this.setState({
      nick: nick,
      logged: true
    })
  }

  logout() {
    const self = this
    axios.post('/logout')
    .then(response => {
      console.log(response)
      self.setState({
        logged: false
      })
    })
    .catch(err => {
      console.error(err)
    });
  }

  render() {
    return (
      <div className="l-main">
        <BrowserRouter>
          <div className="c-header">
            <nav>
              <ul className="c-header__nav">
                <li className="c-header__nav--item"><Link to="/">Home</Link></li>
                <li className="c-header__nav--item"><Link to="/map">Map</Link></li>
                {
                  !this.state.logged ?
                  <li className="c-header__nav--item"><Link to="/getin">Log in</Link></li> :
                  <li><p className="c-header__nav--item c-header__nav--btn" onClick={ this.logout }>Log out</p></li>
                }
              </ul>
            </nav>
            <div className="c-header__nick">
              {
                this.state.nick &&
                <p>Hi, {this.state.nick}</p>
              }
            </div>
          </div>
          
          <div className="l-main__container">
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/map" component={withAuth(Land, this.state.nick)} />
              <Route
                path="/getin"
                render={(props) => <Getin {...props} getUserName={this.getUserName} />}
              />
              </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}