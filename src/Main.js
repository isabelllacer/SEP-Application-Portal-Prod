import React from 'react';
import './Main.css';
import { Link, HashRouter, Route } from 'react-router-dom';
import View from "./View";
import App from "./App";

class Main extends React.Component {
  render() {
    return (
      <HashRouter>
        <div className='app'>
          <header>
              <div className='wrapper'>
                <h1><Link to="/">SEP Application Portal</Link></h1>
              </div>
          </header>
          <Route exact path="/" component={App}/>
          <Route name="view" path="/view/:id" component={View}/>
        </div>
      </HashRouter>
    );
  }
}

export default Main;
