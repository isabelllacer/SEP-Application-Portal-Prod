import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';

class Entry extends React.Component {
  render() {
    const status = this.props.status ?
        ' status' :
        '';
    const colored = this.props.colored ?
        ' colored' :
        '';
    return (
        <div className={'entry' + status + colored}>{this.props.value}</div>
    );
  }
}

class Row extends React.Component {
  render() {
    return (
      <div key={this.props.info.id} className='row'>
        {<Entry value={this.props.info.name}/>}
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
      <div className='row'>
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
