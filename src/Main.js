import React from 'react';
import './Main.css';
import { Link, HashRouter, Route, Switch } from 'react-router-dom';
import View from "./View";
import App from "./App";

class Main extends React.Component {
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
