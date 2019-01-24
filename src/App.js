import React from 'react';
import './App.css';
import firebase from './firebase.js';
import face1 from './pictures/face1.jpg';

class Entry extends React.Component {
  render() {
    if (this.props.name) {
      return (
        <div className='applicant'>
          <div><img className='headshot' src={face1}/></div>
          <div>{this.props.value}</div>
        </div>
      );
    }
    let content;
    if (this.props.colored) {
      let color;
      switch (this.props.value) {
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
          content = this.props.value;
      }
      content = <div className={'highlight ' + color}>{this.props.value}</div>
    } else {
      content = this.props.value;
    }
    return (
        <div className={'entry'}>{content}</div>
    );
  }
}

class Row extends React.Component {
  render() {
    return (
      <div key={this.props.info.id} className='row'>
        {<Entry name={true} value={this.props.info.name}/>}
        {<Entry status={true} colored={true} value={this.props.info.status}/>}
        {<Entry value={this.props.info.major}/>}
        {<Entry value={this.props.info.year}/>}
      </div>
    );
  }
}

class Columns extends React.Component {
  render() {
    return (
      <div className='row columns'>
        {<Entry value={"Applicant"}/>}
        {<Entry status={true} value={"Status"}/>}
        {<Entry value={"Major"}/>}
        {<Entry value={"Year"}/>}
      </div>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref('applicants');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          name: items[item].name,
          status: items[item].status,
          major: items[item].major,
          year: items[item].year
        });
      }
      this.setState({
        items: newState
      });
    });
  }

  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>SEP Application Portal</h1>
            </div>
        </header>
        <div className='table'>
          {<Columns />}
          {this.state.items.map((item) => {
            return <Row info={item}/>; //for iteration: could include "fields" prop w list of columns and adapt info into a string dictionary
          })}
        </div>
      </div>
    );
  }
}

export default App;
