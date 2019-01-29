import React from 'react';
import './View.css';
import firebase from './firebase.js';
import face1 from './pictures/face1.jpg';
import face2 from './pictures/face2.jpg';
import face3 from './pictures/face3.jpg';
import { Link } from 'react-router-dom';


//Pass in id of target
class View extends React.Component {
  constructor() {
    super();
    this.state = {
      appName: "Applicant",
      appInfo: {}
    }
  }

  render() {
    return (
      <div>
        {this.props.location.state.id}
      </div>
    );
  }
}

export default View;
