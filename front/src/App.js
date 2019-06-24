import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
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
    }
  }

  getUserName = (nick) => {
    this.setState({
      nick: nick,
    })
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/map">Map</Link></li>
            <li><Link to="/getin">Register or Login</Link></li>
          </ul>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/map" component={withAuth(Land, this.state.nick)} />
            <Route
              path="/getin"
              render={(props) => <Getin {...props} getUserName={this.getUserName} />}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}