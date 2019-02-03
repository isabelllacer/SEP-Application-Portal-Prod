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
      success: false,
      authFirebaseListener: {}
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

  /*
  componentWillMount() {
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
  }, function(error) {
    console.error('Sign Out Error', error);
  });
  }
  */

  handleSubmit() {
    let self = this;
    const newUsername = this.state.username;
    const newPassword = this.state.password;
    const succ = this.state.success;
    const att = this.state.attempt;
    const listener = this.state.authFirebaseListener;
    this.state.authFirebaseListener = firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password).catch(function(error) {
      console.log(error)
      self.setState({
        username: newUsername,
        password: newPassword,
        attempt: true,
        success: succ,
        authFirebaseListener: listener
      });
    });
    this.setState({
      username: newUsername,
      password: newPassword,
      attempt: false,
      success: succ,
      authFirebaseListener: listener
    });
  }

  //listener triggers BUT componentdidmount does not trigger
  componentDidMount() {
    let self = this;
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      const success = true;
      const newUsername = self.state.username;
      const newPassword = self.state.password;
      const newAttempt = self.state.attempt;
      const listener = self.state.authFirebaseListener;
      self.setState({
        username: newUsername,
        password: newPassword,
        attempt: newAttempt,
        success: success,
        authFirebaseListener: listener
      });
    }
    });
  }

  /*
  componentWillUnmount() {
   this.state.authFirebaseListener && this.state.authFirebaseListener() // Unlisten it by calling it as a function
  }
  */

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
    console.log(attempt);
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
                onClick={() => this.handleSubmit()} ><div>SUBMIT</div></div>
            </form>
          </div>
        </div>
    );
  }
}

export default Login;
