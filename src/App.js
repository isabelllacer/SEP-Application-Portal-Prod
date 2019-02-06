import React from 'react';
import './App.css';
import firebase from './firebase.js';
import fill from './pictures/fill.png';
import gray_star from './pictures/gray_star.png';
import yellow_star from './pictures/yellow_star.png';
import gray_eye from './pictures/gray_eye.png';
import arrow from './pictures/arrow.png';
import { Link, HashRouter, Route } from 'react-router-dom';
import View from "./View";

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

    let color;
    switch (this.props.status) {
      case 'Pending':
        color = 'yellow';
        break;
      case 'Bid':
        color = 'green';
        break;
      case 'Next Round':
        color = 'blue';
        break;
      case 'Cut':
        color = 'red';
        break;

      default:
        color = 'yellow';
      }

    return (
      <div className="dropdownMain entry">
        <div className={"statusContainerMain " + color} onClick={() => this.editClick()}>
          <div className="statusMain">
            {this.props.status}
          </div>
        </div>
        <div className={"optionContainerMain " + show}>
          {options.map((opt) => {
            return opt !== this.props.status ?
            <div className="optionMain" onClick={() => this.optionClick(opt)}>
              {opt}
            </div> :
            <div></div>;
          })}
        </div>
      </div>
    );
  }
}

class Entry extends React.Component {
  handleEyeClick = () => {
    this.props.onEyeClick();
  }

  render() {
    if (this.props.applicant) {
      let face = this.props.picture !== "" ? this.props.picture : fill;
      return (
          <div className='applicant'>
            <div className='head_container'>
              <div className="actions_container">
                <img className='eye' onClick={this.handleEyeClick} src={gray_eye}/>
                <img className='star' onClick={() => this.props.onClick()} src={this.props.star ? yellow_star : gray_star}/>
              </div>
              <Link to={{
                pathname: `/view/${this.props.id}`,
              }}>
                <img className='headshot' src={face}/>
              </Link>
            </div>
            <Link to={{
              pathname: `/view/${this.props.id}`,
              state: {
                id: this.props.id
              }
            }}>
              <div className="appName">{this.props.value}</div>
            </Link>
          </div>
      );
    }
    let content = this.props.value;
    if (this.props.colored) {
      return <Status status={this.props.value} onClick={(option) => {this.props.onClick(option)}}/>;
    }
    const click = this.props.column ? () => this.props.onClick() : null;
    let bold = "";
    if (this.props.sort === this.props.value.toLowerCase()) {
      bold = " bolded";
      const flipped = this.props.sign === -1 ? " flip" : "";
      content = <div className="relContainer">
                  <img className={"arrow" + flipped} src={arrow} />
                  {this.props.value}
                </div>;
    }
    const point = this.props.column ? " point" : "";
    return (
        <div onClick={click} className={'entry' + bold + point}>{content}</div>
    );
  }
}

//TODO: optimize applicant entries
class HiddenApplicant extends React.Component {
  handleEyeClick = () => {
    this.props.onEyeClick();
  }

  render() {
    let face = this.props.picture !== "" ? this.props.picture : fill;
    return (
      <div className='applicant'>
        <div className='head_container'>
          <div className="actions_container">
            <img className='eye' onClick={this.handleEyeClick} src={gray_eye}/>
          </div>
          <img className='headshot' src={fill}/>
        </div>
        <div>{this.props.value}</div>
      </div>
    );
  }
}

class HiddenRow extends React.Component {
  render() {
    if (this.props.collapse) {
      return (
        <div ></div>
      );
    }
    return (
      <div key={this.props.info.id} className={'row'}>
        {<HiddenApplicant picture={this.props.info.picture} onEyeClick={this.props.onEyeClick} value={this.props.info.applicant}/>}
        {<Entry status={true} onClick={(option) => this.props.onStatusClick(option)} colored={true} value={this.props.info.status}/>}
        {<Entry value={this.props.info.major}/>}
        {<Entry value={this.props.info.year}/>}
      </div>
    );
  }
}

class Row extends React.Component {
  render() {
    const starred = this.props.info.star ? ' starred' : '';
    return (
      <div key={this.props.info.id} className={'row' + starred}>
        {<Entry applicant={true} picture={this.props.info.picture} id={this.props.info.id} onClick={() => this.props.onClick()} onEyeClick={this.props.onEyeClick} star={this.props.info.star} value={this.props.info.applicant}/>}
        {<Entry status={true} onClick={(option) => this.props.onStatusClick(option)} colored={true} value={this.props.info.status}/>}
        {<Entry value={this.props.info.major}/>}
        {<Entry value={this.props.info.year}/>}
      </div>
    );
  }
}

class Hider extends React.Component {
  handleClick = () => {
    this.props.onClick();
  }

  render() {

    return (
      <div onClick={this.handleClick} className={'row hider' + (this.props.collapse ? '' : ' active')}>
        <div className={'showContainer'}>
          {this.props.collapse ? "Show" : "Collapse"}
        </div>
        <div className={'hideContainer'}>
          Hidden ({this.props.count})
        </div>
        <div className={'hideLine'}>
        </div>
      </div>
    );
  }
}

class Columns extends React.Component {
  render() {
    return (
      <div className='row columns'>
        {<Entry column={true} sort={this.props.sorter} sign={this.props.sign} onClick={() => this.props.onClick("applicant")} value={"Applicant"}/>}
        {<Entry column={true} sort={this.props.sorter} sign={this.props.sign} onClick={() => this.props.onClick("status")} status={true} value={"Status"}/>}
        {<Entry column={true} sort={this.props.sorter} sign={this.props.sign} onClick={() => this.props.onClick("major")} value={"Major"}/>}
        {<Entry column={true} sort={this.props.sorter} sign={this.props.sign} onClick={() => this.props.onClick("year")} value={"Year"}/>}
      </div>
    );
  }
}

//Pin applicant and status Columns
//State includes list of additional columns
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      sortBy: "applicant",
      sign: 1,
      columns: ["major", "year"],
      hidden: [],
      collapse: true
    }
  }

  //TODO: make id the firebase key, pass key to application view
  //OR retrieve all info here and pass entire item to view. maybe bad bc wont
  //want full list of items in the sidebar in view
  componentDidMount() {

    const images = importAll(require.context('./pictures/applicantPics', false, /\.(png|jpe?g|JPE?G|svg)$/));
    const regex = /-\s[a-zA-Z]+(\s[a-zA-Z\(\)]+)*\s[a-zA-Z-]+\./g; //matches applicant name in picture title
    const newPics = {};

    images.map((path) => {
      const matcher = path.match(regex);
      if (matcher) {
        const found = matcher.length !== 0 ? matcher[0].slice(2, matcher[0].length - 1) : "";
        newPics[found] = path;
        return;
      }
      return;
    });

    const itemsRef = firebase.database().ref();
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      let newHidden = [];

      const hidden = this.state.hidden.map((item) => {
        return "" + item.id;
      });
      const starred = this.state.items.map((item) => {
        return item.star ? "" + item.id : "";
      });

      for (let item in items) {
        const newPic = newPics[items[item].applicant] || "";
        const stat = items[item].status || "Pending";

        if (hidden.includes("" + item)) {
          newHidden.push({
            id: item,
            applicant: items[item].applicant,
            status: items[item].status,
            major: items[item].major,
            year: items[item].year,
            star: false,
            hide: true,
            picture: newPic
          });
        } else {
          const starry = starred.includes(("" + item));
          newState.push({
            id: item,
            applicant: items[item].applicant,
            status: stat,
            major: items[item].major,
            year: items[item].year,
            star: starry,
            hide: false,
            picture: newPic
          });
        }
      }

      const sorter = this.state.sortBy;
      const coll = this.state.collapse;
      const signed = this.state.sign;
      newState.sort(appSort(sorter));
      const cols = this.state.columns.slice();
      this.setState({
        items: newState,
        sortBy: sorter,
        sign: signed,
        columns: cols,
        hidden: newHidden,
        collapse: coll
      });
    });
  }

  hiddenStatusClick(status, index) {
    const appId = this.state.hidden[index].id;
    firebase.database().ref(appId).update({
      status: status
    });
    //componendidmount resets the stars/hides here... way to prevent
  }

  statusClick(status, index) {
    const appId = this.state.items[index].id;
    firebase.database().ref(appId).update({
      status: status
    });
  }

  //both show and hide from click on bar
  //separate: when hider bar clicked, render these items (display of star is none)
  hiddenClick(index) {
    let newItems = this.state.items.slice();
    let newHides = this.state.hidden.slice();
    const sorter = this.state.sortBy;
    const coll = !this.state.collapse;
    const signed = this.state.sign;
    const cols = this.state.columns.slice();
    this.setState({
      items: newItems,
      sortBy: sorter,
      sign: signed,
      columns: cols,
      hidden: newHides,
      collapse: coll
    });
  }

  unhideClick(index) {
    let newItems = this.state.items.slice();
    let newHides = this.state.hidden.slice();
    let item = newHides[index];

    newItems.push(item);
    newHides.splice(index, 1);
    item.hide = false; //TODO: This prop necessary?

    const sorter = this.state.sortBy;
    const sortFunc = appSort(sorter);
    newItems.sort(sortFunc);
    newHides.sort(sortFunc)
    const cols = this.state.columns.slice();
    const coll = this.state.collapse;
    const signed = this.state.sign;
    this.setState({
      items: newItems,
      sortBy: sorter,
      sign: signed,
      columns: cols,
      hidden: newHides,
      collapse: coll,
    });
  }

  eyeClick(index) {
    let newItems = this.state.items.slice();
    let newHides = this.state.hidden.slice();
    let item = newItems[index];

    newHides.push(item);
    newItems.splice(index, 1);
    item.star = false;
    item.hide = true;

    const sorter = this.state.sortBy;
    const signed = this.state.sign;
    const sortFunc = appSort(sorter);
    newItems.sort(sortFunc);
    newHides.sort(sortFunc)
    const cols = this.state.columns.slice();
    const coll = this.state.collapse;
    this.setState({
      items: newItems,
      sortBy: sorter,
      sign: signed,
      columns: cols,
      hidden: newHides,
      collapse: coll,
    });
  }

  starClick(index) {
    let newItems = this.state.items.slice();
    newItems[index].star = newItems[index].star ? false : true;
    const sorter = this.state.sortBy;
    const coll = this.state.collapse;
    newItems.sort(appSort(sorter));
    const cols = this.state.columns.slice();
    const signed = this.state.sign;
    const hid = this.state.hidden;
    this.setState({
      items: newItems,
      sortBy: sorter,
      sign: signed,
      columns: cols,
      hidden: hid,
      collapse: coll
    });
  }

  //uppercase for ascending sort, lowercase for descending sort
  columnClick(value) {
    let newItems = this.state.items.slice();
    let signed = this.state.sign;
    if (value === this.state.sortBy) {
      signed = -1 * signed;
    }
    newItems.sort(appSort(value, signed));
    const cols = this.state.columns.slice();
    const hid = this.state.hidden;
    const coll = this.state.collapse;
    this.setState({
      items: newItems,
      sortBy: value,
      sign: signed,
      columns: cols,
      hidden: hid,
      collapse: coll
    });
  }

  render() {
    //this is an array of strings which are paths you can put directly into img src
    //TODO: Move this into component didmount, put images array into state, do regex matching here
    //add more padding to right side of view
    console.log(this.props.location.pathname);
    return (
        <div className={this.props.location.pathname == "/home" ? 'app' : 'app inactive'}>
          <div className='table'>
            {<Columns
              onClick={(v) => this.columnClick(v)}
              sorter={this.state.sortBy}
              sign={this.state.sign}
              />}
            {this.state.items.map((item, i) => {
              return <Row
                        info={item}
                        onClick={() => this.starClick(i)}
                        onEyeClick={() => this.eyeClick(i)}
                        onStatusClick={(status) => this.statusClick(status, i)}
                      />;
            })}
            <Hider count={this.state.hidden.length} onClick={() => this.hiddenClick()} collapse={this.state.collapse}/>
            {this.state.hidden.map((item, i) => {
              return <HiddenRow info={item} collapse={this.state.collapse} onEyeClick={() => this.unhideClick(i)} onStatusClick={(status) => this.hiddenStatusClick(status, i)}/>;
            })}
          </div>
        </div>
    );
  }
}

function importAll(r) {
  return r.keys().map(r);
}

//if recent = sorter, negate the state
//add state to function. though this isnt a react component
function appSort(sorter, sign){
  return function (a, b) {
    if ((a.star === true) && (b.star !== true)) {
      return -1;
    }
    if ((a.star !== true) && (b.star === true)) {
      return 1;
    }
    var nameA=a[sorter].toLowerCase(), nameB=b[sorter].toLowerCase();
    switch (sorter.toLowerCase()) {
      case 'status':
        const statMap = {bid: 0, nextround: 1, pending: 2, cut: 4};
        nameA = nameA.replace(/\s+/g, '');
        nameB = nameB.replace(/\s+/g, '');
        if (statMap[nameA] < statMap[nameB])
          return -1 * sign;
        if (statMap[nameA] > statMap[nameB])
          return 1 * sign;
        return 0;
      case 'year':
        const yearMap = {freshman: 0, sophomore: 1, junior: 2, senior: 4};
        if (yearMap[nameA] < yearMap[nameB])
          return -1 * sign;
        if (yearMap[nameA] > yearMap[nameB])
          return 1 * sign;
        return 0;
      default:
        if (nameA < nameB)
          return -1 * sign;
        if (nameA > nameB)
          return 1 * sign;
        return 0;
    }
  }
}

export default App;
