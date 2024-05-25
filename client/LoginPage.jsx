// LoginPage.jsx
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
			this.props.onLogin();
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
			<div className="login-page">
				<h2>로그인</h2>
				<form onSubmit={this.handleSubmit}>
					<input
						type="text"
						name="username"
						placeholder="아이디 입력"
						value={this.state.username}
						onChange={this.handleChange}
					/>
					<input
						type="password"
						name="password"
						placeholder="비밀번호 입력"
						value={this.state.password}
						onChange={this.handleChange}
					/>
					<button type="submit">로그인</button>
				</form>
				<button onClick={this.handleSignUpClick}>회원가입</button>
			</div>
		);
	}
});

module.exports = LoginPage;
