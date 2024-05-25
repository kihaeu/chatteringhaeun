// SignUpPage.jsx
'use strict';

var React = require('react');

var SignUpPage = React.createClass({
	getInitialState() {
		return {username: '', password: '', confirmPassword: ''};
	},

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	},

	handleSubmit(e) {
		e.preventDefault();
		if (this.state.password !== this.state.confirmPassword) {
			return alert('Passwords do not match');
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
			this.props.onSignUpSuccess();
		})
		.catch(error => {
			alert('Error signing up: ' + error.message);
		});
	},

	render() {
		return (
			<div className="sign-up-page">
				<h2>회원가입</h2>
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
					<input
						type="password"
						name="confirmPassword"
						placeholder="비밀번호 확인"
						value={this.state.confirmPassword}
						onChange={this.handleChange}
					/>
					<button type="submit">회원가입</button>
				</form>
			</div>
		);
	}
});

module.exports = SignUpPage;
