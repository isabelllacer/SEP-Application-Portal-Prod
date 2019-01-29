import React from 'react';
import './Main.css';
import firebase from './firebase.js';
import face1 from './pictures/face1.jpg';
import face2 from './pictures/face2.jpg';
import face3 from './pictures/face3.jpg';
import gray_star from './pictures/gray_star.png';
import yellow_star from './pictures/yellow_star.png';
import gray_eye from './pictures/gray_eye.png';
import arrow from './pictures/arrow.png';
import { Link, HashRouter, Route } from 'react-router-dom';
import View from "./View";
import App from "./App";

//Pin applicant and status Columns
//State includes list of additional columns
class Main extends React.Component {
  constructor() {
    super();
  }

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
          <Route path="/view" component={View}/>
        </div>
      </HashRouter>
    );
  }
}

export default Main;
