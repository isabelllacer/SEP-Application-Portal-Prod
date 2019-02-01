import React from 'react';
import './Login.css';
import firebase from './firebase.js';
import logo from './pictures/sep_logo_black.png';
import { Link, HashRouter, Route } from 'react-router-dom';
import Main from "./Main";

class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "Username",
      password: "Password",
      success: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit() {

  }

  render() {
    return (
      <HashRouter>
        <div className="background">
          <div className="modal">
            <div className="logo">
              <img className="loginLogo" src={logo} />
            </div>
            <form>
              <input
                name="Username"
                className="inputter"
                type="text"
                value={this.state.Username}
                onChange={this.handleInputChange} />
              <br />
              <input
                name="Password"
                className="inputter"
                type="text"
                value={this.state.Password}
                onChange={this.handleInputChange} />
              <br />
              <input
                type="submit"
                className="submit"
                value="SUBMIT"
                onClick={() => this.handleSubmit()} />
            </form>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Login;
