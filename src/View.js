import React from 'react';
import './View.css';
import firebase from './firebase.js';
import face1 from './pictures/face1.jpg';
import face2 from './pictures/face2.jpg';
import face3 from './pictures/face3.jpg';
import { Link } from 'react-router-dom';

class Detail extends React.Component {
  render() {
    return (
      <div className="detail">
        <span className="bolded"> {this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)}: </span>
        {this.props.value}
      </div>
    );
  }
}

class View extends React.Component {
  constructor() {
    super();
    this.state = {
      appId: null,
      status: "",
      appInfo: {
        applicant: "",
        major: "",
        year: "",
        gpa: "",
        resume: "",
        email: "",
        phone: ""
      },
      qs: [],
      appList: []
    }
  }

  //will need to parse out left column info and right column info into state
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

      const stat = app["status"];
      delete app.status;
      app["gpa"] = "4.0";
      app["resume"] = "";
      app["email"] = "apalmer@berkeley.edu";
      app["phone"] = "4085504766";

      let newQs = [];
      newQs.push({
        title: "Applicantion Questions",
        subs: [{subtitle: "List your other time commitments for the semester.",
        content: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa."`
        },
        {subtitle: "Tell us about your interests.",
        content: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa."`
        },
        {subtitle: `"Why do you want to be in Sigma Eta Pi? How will you
          contribute to the organization? (250 words or less)"`,
        content: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. Fusce nec nunc ante. Nam feugiat elit
          justo, ac eleifend urna dapibus vel. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Mauris vehicula, erat ut mattis volutpa."`
      }]});

      this.setState({
        appId: this.props.match.params.id,
        status: stat,
        appInfo: app,
        qs: newQs,
        appList: newList
      });
    });
  }

  render() {
    console.log(Object.keys(this.state.appInfo));
    return (
      <div>
        <div className="leftCol">
          <div className="name">
            {this.state.appInfo.applicant}
          </div>
          <div className="shot">
            <img className='headPic' src={face2}/>
          </div>
          {Object.keys(this.state.appInfo).map((field) => {
            return <Detail category={field} value={this.state.appInfo[field]}/>;
          })}
        </div>
        <div className="rightCol">
        {this.state.qs.map((question) => {
          return <div>{question.title}</div>;
        })}
        </div>
      </div>
    );
  }
}

export default View;
