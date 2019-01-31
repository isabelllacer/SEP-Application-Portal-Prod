import React from 'react';
import './View.css';
import firebase from './firebase.js';
import face1 from './pictures/face1.jpg';
import face2 from './pictures/face2.jpg';
import face3 from './pictures/face3.jpg';
import { Link } from 'react-router-dom';

class Subquestion extends React.Component {
  render() {
    const score = this.props.score || 0;
    let color;
    switch (score + '') {
      case '5':
        color = 'five';
        break;
      case '4':
        color = 'four';
        break;
      case '3':
        color = 'three';
        break;
      case '2':
        color = 'two';
        break;
      default:
        color = 'one';
    }

    const scoreBox = score !== 0 ?
      <div className={"subscore sub" + color}>
        <div className="subnumber">{this.props.score}</div>
        <div>Score</div>
      </div> :
      <div></div>;

    const subtitle = this.props.subtitle || "";
    const subtitleBox = subtitle === "" ?
      <div></div> :
      <div className="subtitle">
      {scoreBox}
      <div>{this.props.subtitle}</div>
      </div>;

    return (
      <div className="subquestion">
        {subtitleBox}
        <div className={"content" + (subtitle === "" ? " bigger" : "")}>{this.props.content}</div>
      </div>
    );
  }
}

/* Cases:
Subtitle Scores
Notes Format (No Title Score)
Interviwers Slot
*/
class Questions extends React.Component {
  render() {
    const score = this.props.score || 0;
    let color;
    switch (score + '') {
      case '5':
        color = 'five';
        break;
      case '4':
        color = 'four';
        break;
      case '3':
        color = 'three';
        break;
      case '2':
        color = 'two';
        break;
      default:
        color = 'one';
    }
    const scoreBox = score !== 0 ?
      <div className={"score " + color}>
        <div className="number">{this.props.score}</div>
        <div>Score</div>
      </div> :
      <div className="filler"></div>;

      const interviewers = this.props.interviewers || [];
      const interview = interviewers.length > 0 ?
      <div className="interviewers">
        <span className="bolded">Interviewers: </span>
        {interviewers.map((i, index) => {
          const end = index === interviewers.length - 1 ? "" : ", ";
          return i + end;
        })}
      </div> :
      <div></div>;

    return (
      <div className="questions">
        <div className="title">
          {scoreBox}
          <div className=""> {this.props.title}</div>
        </div>
        {interview}
        {this.props.subs.map((subq) => {
          return <Subquestion subtitle={subq.subtitle} score={subq.score} content={subq.content}/>;
        })}
      </div>
    );
  }
}

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
  //TODO: nullstate of score but needed eventually
  //REMEMBER order of Qs matter (currently determined by firebase order)
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
        title: "Notes",
        subs: [{content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. `
      }]});

      newQs.push({
        title: "Application Questions",
        score: 5,
        subs: [{subtitle: "List your other time commitments for the semester.",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa.`
        },
        {subtitle: "Tell us about your interests.",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa.`
        },
        {subtitle: `Why do you want to be in Sigma Eta Pi? How will you
          contribute to the organization? (250 words or less)`,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. Fusce nec nunc ante. Nam feugiat elit
          justo, ac eleifend urna dapibus vel. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Mauris vehicula, erat ut mattis volutpa.`
      }]});

      newQs.push({
        title: "Professional Interview",
        score: 2,
        interviewers: ["LeAnne", "Isabel", "Alex"],
        subs: [{subtitle: "List your other time commitments for the semester.",
        score: 5,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa.`
        },
        {subtitle: "Tell us about your interests.",
        score: 4,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa.`
        },
        {subtitle: `Why do you want to be in Sigma Eta Pi? How will you
          contribute to the organization? (250 words or less)`,
        score: 3,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. Fusce nec nunc ante. Nam feugiat elit
          justo, ac eleifend urna dapibus vel. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Mauris vehicula, erat ut mattis volutpa.`
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
    return (
      <div className="container">
        <div className="leftCol">
          <div className="name">
            {this.state.appInfo.applicant}
          </div>
          <div className="shot">
            <img className='headPic' src={face1}/>
          </div>
          {Object.keys(this.state.appInfo).map((field) => {
            return <Detail category={field} value={this.state.appInfo[field]}/>;
          })}
        </div>
        <div className="rightCol">
        {this.state.qs.map((question) => {
          return <Questions title={question.title} score={question.score} interviewers={question.interviewers} subs={question.subs}/>;
        })}
        </div>
      </div>
    );
  }
}

export default View;
