'use strict';

var React = require('react');

var SignUpPage = React.createClass({
   getInitialState() {
      return { username: '', password: '', confirmPassword: '' };
   },

   handleChange(e) {
      this.setState({ [e.target.name]: e.target.value });
   },

   handleSubmit(e) {
      e.preventDefault();
      if (this.state.password !== this.state.confirmPassword) {
         alert('Passwords do not match!');
         return;
      }
      fetch('/signup', {
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
         this.props.onSignUpSuccess(this.state.username);
      })
      .catch(error => {
         alert('Error signing up: ' + error.message);
      });
   },

   handleLoginClick() {
      this.props.onLogin();
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
                  <input
                     type="password"
                     name="confirmPassword"
                     placeholder="비밀번호 확인"
                     value={this.state.confirmPassword}
                     onChange={this.handleChange}
                  />
                  <div className="button-group">
                     <button type="submit">회원가입</button>
                     <span className="span-button" onClick={this.handleLoginClick}>| 로그인 |</span>
                  </div>
               </form>
            </div>
         </div>
      );
   }
});

module.exports = SignUpPage;
