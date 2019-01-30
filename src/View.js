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
      appInfo: {},
      appList: []
    }
  }

  componentDidMount() {
    let app;
    let newList = [];

    const appRef = firebase.database().ref('applicants/'+this.props.match.params.id);
    appRef.on('value', (snapshot) => {
      app = snapshot.val();
    });

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

    this.setState({
      appId: this.props.match.params.id,
      appInfo: app,
      appList: newList
    });
  }

  render() {
    return (
      <div>
        {this.state.appId}
      </div>
    );
  }
}

export default View;
