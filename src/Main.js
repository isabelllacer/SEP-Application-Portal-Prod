import React from 'react';
import './Main.css';
import firebase from './firebase.js';
import { Link, HashRouter, Route, Switch } from 'react-router-dom';
import View from "./View";
import App from "./App";

class Main extends React.Component {
  constructor(props, context) {
      super(props, context);
      this.componentCleanup = this.componentCleanup.bind(this);
  }

  componentCleanup() {
    firebase.auth().signOut().then(function() {
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  }

  componentDidMount(){
    window.addEventListener('beforeunload', this.componentCleanup);
  }

  componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup); // remove the event handler for normal unmounting
    }

  render() {
    return (
        <div className='app'>
          <header>
              <div className='wrapper'>
                <h1><Link to="/">SEP Application Portal</Link></h1>
              </div>
          </header>
          <Switch>
            <Route exact path="/" component={App}/>
            <Route name="view" path="/view/:id" component={View}/>
          </Switch>
        </div>
    );
  }
}

export default Main;
