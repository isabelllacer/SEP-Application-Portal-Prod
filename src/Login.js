import React from 'react';
import './Login.css';
import firebase from './firebase.js';
import logo from './pictures/sep_logo_black.png';
import { Link, HashRouter, Route, Redirect } from 'react-router-dom';
import Main from "./Main";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "Username",
      password: "Password",
      attempt: false,
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
    //login, if successful redirect
    console.log("Proper submit called");
    let self = this.state;
    firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password).catch(function(error) {
      console.log(error)
      self.attempt = true;
    });
  }

  //component did mount not good for detecting logged in because need re-render to trigger
  componentDidMount() {
    let self = this;
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Logged in")
      self.state.success = true;
      }
    });
  }

  render() {
    if (this.state.success) {
      return (<HashRouter>
        <div>
          <Redirect to="/"/>
          <Route path="/" component={Main}/>
        </div>
        </HashRouter>);
    }
    const attempt = this.state.attempt ? "bad" : "";
    return (
        <div className="background">
          <div className="modal">
            <div className="logo">
              <img className="loginLogo" src={logo} />
            </div>
            <div className={"attempt "+attempt}>Incorrect username or password.</div>
            <form>
              <input
                name="username"
                className="inputter"
                type="text"
                value={this.state.Username}
                onChange={this.handleInputChange} />
              <br />
              <input
                name="password"
                className="inputter"
                type="text"
                value={this.state.Password}
                onChange={this.handleInputChange} />
              <br />
              <div
                className="submit"
                onClick={() => this.handleSubmit()} >SUBMIT</div>
            </form>
          </div>
        </div>
    );
  }
}

export default Login;
