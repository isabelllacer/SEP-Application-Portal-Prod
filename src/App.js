import React from 'react';
import './App.css';
import firebase from './firebase.js';
import face1 from './pictures/face1.jpg';
import gray_star from './pictures/gray_star.png';
import yellow_star from './pictures/yellow_star.png';
import gray_eye from './pictures/gray_eye.png';

class Entry extends React.Component {
  render() {
    if (this.props.name) {
      return (
        <div className='applicant'>
          <div className='head_container'>
            <div className="actions_container">
              <img className='eye' src={gray_eye}/>
              <img className='star' onClick={() => this.props.onClick()} src={this.props.star ? yellow_star : gray_star}/>
            </div>
            <img className='headshot' src={face1}/>
          </div>
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
    const click = this.props.column ? () => this.props.onClick() : null;
    console.log(this.props.sort === this.props.value.toLowerCase());
    const bold = this.props.sort === this.props.value.toLowerCase() ? " bolded" : "";
    const point = this.props.column ? " point" : "";
    return (
        <div onClick={click} className={'entry' + bold + point}>{content}</div>
    );
  }
}

class Row extends React.Component {
  render() {
    const starred = this.props.info.star ? ' starred' : '';
    return (
      <div key={this.props.info.id} className={'row' + starred}>
        {<Entry name={true} onClick={() => this.props.onClick()} star={this.props.info.star} hide={this.props.info.hide} value={this.props.info.name}/>}
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
        {<Entry column={true} sort={this.props.sorter} onClick={() => this.props.onClick("name")} value={"Applicant"}/>}
        {<Entry column={true} sort={this.props.sorter} onClick={() => this.props.onClick("status")} status={true} value={"Status"}/>}
        {<Entry column={true} sort={this.props.sorter} onClick={() => this.props.onClick("major")} value={"Major"}/>}
        {<Entry column={true} sort={this.props.sorter} onClick={() => this.props.onClick("year")} value={"Year"}/>}
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
      sortBy: "name",
      columns: ["major", "year"]
    }
  }

  //TODO: Sort here
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
          year: items[item].year,
          star: false,
          hide: false,
        });
      }
      const sorter = this.state.sortBy;
      newState.sort(function (a, b) { //TODO: Adapt this into flexible sort function
        var nameA=a[sorter].toLowerCase(), nameB=b[sorter].toLowerCase();
        if (nameA < nameB)
          return -1;
        if (nameA > nameB)
          return 1;
        return 0;
      });
      const cols = this.state.columns.slice();
      this.setState({
        items: newState,
        sortBy: sorter,
        columns: cols
      });
    });
  }

  //TODO: Rethink state
  starClick(index) {
    //put item on top
    let newItems = this.state.items.slice();
    newItems[index].star = newItems[index].star ? false : true;
    const sorter = this.state.sortBy;
    newItems.sort(function (a, b) {
      if ((a.star === true) && (b.star !== true)) {
        return -1;
      }
      if ((a.star !== true) && (b.star === true)) {
        return 1;
      }
      var nameA=a[sorter].toLowerCase(), nameB=b[sorter].toLowerCase();
      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    });
    const cols = this.state.columns.slice();
    this.setState({
      items: newItems,
      sortBy: sorter,
      columns: cols
    });
  }

  columnClick(value) {
    let newItems = this.state.items.slice();
    const sorter = value;
    newItems.sort(function (a, b) {
      if ((a.star === true) && (b.star !== true)) {
        return -1;
      }
      if ((a.star !== true) && (b.star === true)) {
        return 1;
      }
      var nameA=a[sorter].toLowerCase(), nameB=b[sorter].toLowerCase();
      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    });
    const cols = this.state.columns.slice();
    this.setState({
      items: newItems,
      sortBy: sorter,
      columns: cols
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
          {<Columns onClick={(v) => this.columnClick(v)} sorter={this.state.sortBy}/>}
          {this.state.items.map((item, i) => {
            return <Row info={item} onClick={() => this.starClick(i)}/>; //for iteration: could include "fields" prop w list of columns and adapt info into a string dictionary
          })}
        </div>
      </div>
    );
  }
}

export default App;
