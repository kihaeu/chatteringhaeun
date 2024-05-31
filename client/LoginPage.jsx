'use strict';

var React = require('react');

var LoginPage = React.createClass({
   getInitialState() {
      return {username: '', password: ''};
   },

   handleChange(e) {
      this.setState({ [e.target.name]: e.target.value });
   },

   handleSubmit(e) {
      e.preventDefault();
      fetch('/login', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            username: this.state.username,
            password: this.state.password
         })
      })
      .then(response => {
         if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
         }
         return response.text();
      })
      .then(data => {
         alert(data);
         this.props.onLogin(this.state.username);
      })
      .catch(error => {
         alert('Error logging in: ' + error.message);
      });
   },

   handleSignUpClick() {
      this.props.onSignUp();
   },

   render() {
      return (
         <div className="login-container">
            <div className="login-box">
               <div className="login-header">
                  <img src="images/twolion.png" alt="Logo" className="logo-image" />
                  <h2>회원가입</h2>
               </div>
               <form onSubmit={this.handleSubmit}>
                  <input
                     type="text"
                     name="username"
                     placeholder="아이디"
                     value={this.state.username}
                     onChange={this.handleChange}
                  />
                  <input
                     type="password"
                     name="password"
                     placeholder="비밀번호"
                     value={this.state.password}
                     onChange={this.handleChange}
                  />
                  <div className="button-group">
                     <button type="submit">로그인</button>
                     <button type="button" onClick={this.handleSignUpClick}>회원가입</button>
                  </div>
               </form>
            </div>
         </div>
      );
   }
});

module.exports = LoginPage;
