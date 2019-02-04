import React from 'react';
import './View.css';
import firebase from './firebase.js';
import fill from './pictures/fill.png';
import pencil from './pictures/black_pencil.png';
import eye from './pictures/black_eye.png';
import { Link } from 'react-router-dom';

class SubscoreBox extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false
    }
  }

  scoreClick() {
    const newActive = !this.state.active;
    this.setState({
      active: newActive
    });
  }

  listClick(option) {
      this.scoreClick();
      this.props.onClick(option);
  }

  render() {
  let color;
  switch (this.props.score + '') {
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

    const options = ["5", "4", "3", "2", "1"];
    const show = this.state.active ? "active" : "inactive";

    return <div className="subscoreContainer">
          <div className={"subscore sub" + color} onClick={() => this.scoreClick()}>
            <div className="subnumber">{this.props.score}</div>
            <div>Score</div>
          </div>
          <div className={"suboptContainer " + show}>
          {options.map((option) => {
            return (this.props.score + "") !== option ?
              <div className={"subscoreOpt "} onClick={() => this.listClick(option)}>{option}</div> :
              <div></div>;
          })}
          </div>
        </div>;
  }
}

class Subquestion extends React.Component {
  constructor() {
    super();

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.props.handleInputChange(event, this.props.index);
  }

  componentDidMount() {
    this.setState({
      content: this.props.content
    });
  }

  render() {
    const score = this.props.score || 0;
    const scoreBox = score !== 0 ?
      <SubscoreBox score={score} onClick={(option) => this.props.onClick(option)}/>:
      <div></div>;

    const subtitle = this.props.subtitle || "";
    const subtitleBox = subtitle === "" ?
      <div></div> :
      <div className="subtitle">
      {scoreBox}
      <div>{this.props.subtitle}</div>
      </div>;

    //<div className={"editContent" + (subtitle === "" ? " bigger" : "")}>{this.props.content}</div>
    const content = this.props.editMode ?
      <form className="notesForm">
      <textarea
        name="content"
        className="inputter2 editContent"
        type="text"
        value={this.props.content}
        onChange={this.handleInputChange} />
      </form> :
      <div className={"content" + (subtitle === "" ? " bigger" : "")}>{this.props.content}</div>;

    return (
      <div className="subquestion">
        {subtitleBox}
        {content}
      </div>
    );
  }
}

class ScoreBox extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false
    }
  }

  scoreClick() {
    const newActive = !this.state.active;
    this.setState({
      active: newActive
    });
  }

  listClick(option) {
      this.scoreClick();
      this.props.onClick(option);
  }

  render() {
  let color;
  switch (this.props.score + '') {
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

    const options = ["5", "4", "3", "2", "1"];
    const show = this.state.active ? "active" : "inactive";

    return <div className="scoreContainer">
          <div className={"score " + color} onClick={() => this.scoreClick()}>
            <div className="number">{this.props.score}</div>
            <div>Score</div>
          </div>
          <div className={"optContainer " + show}>
          {options.map((option) => {
            return (this.props.score + "") !== option ?
              <div className={"scoreOpt "} onClick={() => this.listClick(option)}>{option}</div> :
              <div></div>;
          })}
          </div>
        </div>;
  }
}

/* Add pencil button, with onClick turns on edit mode, pass to subquestions, hide pencil show save button
  Add save button, onClick turns off edit mode, pass to subquestions, hide save button show pencil button
  add state and functions here
*/
class Questions extends React.Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      subqs: []
    }
  }

  handleInputChange(event, index) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    const editing = this.state.edit;
    const subs = this.state.subqs.slice();
    subs[index].content = value;
    this.setState({
      edit: editing,
      subqs: subs
    });
  }

  componentDidMount() {
    const editing = this.state.edit;
    this.setState({
      edit: editing,
      subqs: this.props.subs
    });
  }

  pencilClick() {
    const subs = this.state.subqs.slice();
    this.setState({
      edit: true,
      subqs: subs
    });
  }

  saveClick() {
    const subs = this.state.subqs.slice();
    this.setState({
      edit: false,
      subqs: subs
      //send subqs to database
    });
    this.props.notesEdit(subs[0].content);
    //need to get subquestion value and send to firebase in subquestion
    //will need to store content in this constructor
  }

  render() {
    const score = this.props.score || 0;
    const section = this.props.title.toLowerCase();
    const scoreBox = (section === "professional interview" ||  section === "group interview")  ?
    <ScoreBox score={score} onClick={(option) => this.props.scoreClick(option)}/> :
      <div className="filler"></div>;
    let editButton = <div></div>;
    if (section === "notes") {
      editButton = this.state.edit === false ?
      <div className="editContainer" onClick={() => this.pencilClick()}>
        <img className="editPencil" src={pencil} />
      </div> :
      <div className="editContainer" onClick={() => this.saveClick()}>
        <div className="saveContainer"><div>Save</div></div>
      </div>;
    }

      const interviewers = this.props.interviewers || "";
      const interview = interviewers !== "" ?
      <div className="interviewers">
        <span className="bolded">Interviewers: </span>
        {interviewers}
      </div> :
      <div></div>;

    return (
      <div className="questions">
        <div className="title">
          {scoreBox}
          <div className=""> {this.props.title}</div>
          {editButton}
        </div>
        {interview}
        {this.state.subqs.map((subq, index) => {
          return <Subquestion subtitle={subq.subtitle} editMode={this.state.edit} onClick={(option) => this.props.subscoreClick(option, index)} handleInputChange={(e, i) => this.handleInputChange(e, i)} index={index} score={subq.score} content={subq.content}/>;
        })}
      </div>
    );
  }
}

//own internal state of showing dropdown
//list of absolutely positioned divs
//onclick of each passed from parent to update app state.
//remember status is capital letter first

//clicking an option should close dropdown. add onto passed in function
class Status extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false
    }
  }

  editClick() {
    const newActive = !this.state.active;
    this.setState({
      active: newActive
    });
  }

  optionClick(option) {
      this.editClick();
      this.props.onClick(option);
  }

  render() {
    const options = ["Pending", "Next Round", "Bid", "Cut"];
    const show = this.state.active ? "active" : "inactive";

    return (
      <div className="dropdown">
        <div className="statusContainer" onClick={() => this.editClick()}>
          <div className="status">
            {this.props.status}
          </div>
          <div className="statusEdit">
            <img className="pencil" src={pencil} />
          </div>
        </div>
        <div className={"optionContainer " + show}>
          {options.map((opt) => {
            return opt !== this.props.status ?
            <div className="option" onClick={() => this.optionClick(opt)}>
              {opt}
            </div> :
            <div></div>;
          })}
        </div>
      </div>
    );
  }
}

class Detail extends React.Component {
  render() {
    const category = this.props.category;
    if (category === "resume") {
      return (
        <div className="resume">
          <span className="bolded">
            <a className="resumeLink" target="_blank" href={this.props.value}> Open Resume </a>
          </span>
        </div>
      );
    }

    return (
      <div className="detail">
        <span className="bolded"> {category === "gpa" ? category.toUpperCase() : category.charAt(0).toUpperCase() + category.slice(1)}: </span>
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
      face: fill,
      qs: [],
      appList: []
    }
  }

  componentDidMount() {
    var app = {};
    let newList = [];

    const itemsRef = firebase.database().ref();
    itemsRef.once('value', (snapshot) => {
      let items = snapshot.val();
      for (let item in items) {
        newList.push({
          id: item,
          applicant: items[item].applicant
        });
      }
    });

    const appRef = firebase.database().ref(this.props.match.params.id);
    appRef.on('value', (snapshot) => {
      app = snapshot.val();

      const images = importAll(require.context('./pictures/applicantPics', false, /\.(png|jpe?g|JPE?G|svg)$/));
      const regex = /-\s[a-zA-Z]+(\s[a-zA-Z\(\)]+)*\s[a-zA-Z-]+\./g; //matches applicant name in picture title

      //if match from regex equals applicant name, use that path
      let face = fill;
      images.map((path) => {
        const matcher = path.match(regex);
        if (matcher) {
          const found = matcher.length !== 0 ? matcher[0].slice(2, matcher[0].length - 1) : "";
          if (found === app.applicant) {
            face = path;
          }
          return;
        }
        return;
      });

      const stat = app.status || "Pending";
      const newNotes = app.notes || "None";
      const newScore = app.appScore || 0;
      let newQs = [];
      newQs.push({
        title: "Notes",
        subs: [{content: newNotes
      }]});

      newQs.push({
        title: "Application Questions",
        score: newScore,
        subs: [{subtitle: "List your other time commitments for the semester.",
        content: app.q1
        },
        {subtitle: "Tell us about a time you took initiative. What was your final impact? (250 words max)",
        content: app.q2
        },
        {subtitle: `Tell us about a pressing societal problem you care about. (250 words max)`,
        content: app.q3
      }]});

      const newInter = app.interview || 0;
      if (newInter !== 0) {
        //need to add overall notes section
        const overall = newInter.notes || "";
        let subqs = newInter.questions;
        if (overall !== "") {
          subqs.push({
            subtitle: "General Notes",
            content: overall
          });
        }

        newQs.push({
          title: "Professional Interview",
          score: newInter.score,
          interviewers: newInter.interviewers,
          subs: subqs});
      }

      const newChat = app.coffeeChat || 0;
      if (newChat !== 0) {
        newQs.push({
          title: "Coffee Chat",
          interviewers: newChat.interviewers,
          subs: [{content: newChat.notes}]});
      }

      //IMPORTANT clean up so we can iterate on left column later
      delete app['interview'];
      delete app['status'];
      delete app['notes'];
      delete app['coffeeChat'];

      this.setState({
        appId: this.props.match.params.id,
        status: stat,
        appInfo: app,
        face: face,
        qs: newQs,
        appList: newList
      });
    });
  }

  notesEdit(newNotes) {
    firebase.database().ref(this.state.appId).update({
      notes: newNotes
    });
  }

  subscoreClick(option, i1, i2) {
    //firebase.database().ref(this.state.appId).update({
    //  status: option
    //});
    //set qs at given index's score to option
    let newQs = this.state.qs.slice();
    newQs[i1].subs[i2].score = option;
    this.setState({
      appId: this.state.appId,
      status: this.state.status,
      appInfo: this.state.appInfo,
      face: this.state.face,
      qs: newQs,
      appList: this.state.appList
    });
  }

  scoreClick(option, index) {
    firebase.database().ref(this.state.appId).update({
      appScore: option
    });
    let newQs = this.state.qs.slice(); //may be unnecessary
    newQs[index].score = option;
    this.setState({
      appId: this.state.appId,
      status: this.state.status,
      appInfo: this.state.appInfo,
      face: this.state.face,
      qs: newQs,
      appList: this.state.appList
    });
  }

  statusClick(option) {
    firebase.database().ref(this.state.appId).update({
      status: option
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
            <img className='headPic' src={this.state.face}/>
          </div>
          <Status status={this.state.status} onClick={(option) => this.statusClick(option)}/>
          {Object.keys(this.state.appInfo).map((field) => {
            if ((field === "q1") || (field === "q2") || (field === "q3") || (field === "resume")) {
              return <div></div>;
            }
            return <Detail category={field} value={this.state.appInfo[field]}/>;
          })}
          <Detail category={"resume"} value={this.state.appInfo["resume"]}/>
        </div>
        <div className="rightCol">
        {this.state.qs.map((question, index) => {
          return <Questions
            title={question.title}
            score={question.score}
            interviewers={question.interviewers}
            subs={question.subs}
            scoreClick={(option) => this.scoreClick(option, index)}
            subscoreClick={(option, i2) => this.subscoreClick(option, index, i2)}
            notesEdit={(newNotes) => this.notesEdit(newNotes)}
            />;
        })}
        </div>
      </div>
    );
  }
}

function importAll(r) {
  return r.keys().map(r);
}

export default View;
