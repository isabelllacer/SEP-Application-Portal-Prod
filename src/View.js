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
      appId: null,
      appInfo: {
        applicant: "",
        major: "",
        year: "",
        status: ""
      },
      appList: []
    }
  }

  componentDidMount() {
    var app = {};
    let newList = [];

    const itemsRef = firebase.database().ref('applicants');
    itemsRef.once('value', (snapshot) => {
      let items = snapshot.val();
      for (let item in items) {
        newList.push({
          id: item,
          applicant: items[item].applicant
        });
      }
    });

    const appRef = firebase.database().ref('applicants/'+this.props.match.params.id);
    appRef.on('value', (snapshot) => {
      app = snapshot.val();

      this.setState({
        appId: this.props.match.params.id,
        appInfo: app,
        appList: newList
      });
    });
  }

  render() {
    return (
      <div>
        <div className="leftCol">
          <div className="name">
            {this.state.appInfo.applicant}
          </div>
          <div className="shot">
            <img className='headPic' src={face2}/>
          </div>
          <div className="status">
            {this.state.appInfo.applicant}
          </div>
          <div className="year">
            {this.state.appInfo.applicant}
          </div>
          <div className="major">
            {this.state.appInfo.applicant}
          </div>
          <div className="gpa">
            {this.state.appInfo.applicant}
          </div>
          <div className="resume">
            {this.state.appInfo.applicant}
          </div>
          <div className="email">
            {this.state.appInfo.applicant}
          </div>
          <div className="phone">
            {this.state.appInfo.applicant}
          </div>
        </div>
        <div className="rightCol">
          <div className="field">
            <div className="head">
              Notes
            </div>
            <div className="body">
              Tyler: They are too old
            </div>
          </div>
          <div className="field">
            <div className="head">
              Notes
            </div>
            <div className="body">
              Tyler: They are too old
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default View;
