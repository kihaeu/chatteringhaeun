// app.jsx
'use strict';

var React = require('react');
var ChatApp = require('./ChatApp.jsx');
var LoginPage = require('./LoginPage.jsx');
var SignUpPage = require('./SignUpPage.jsx');

var App = React.createClass({
	getInitialState() {
		return {page: 'login'};
	},

	handleLogin() {
		this.setState({page: 'chat'});
	},

	handleSignUp() {
		this.setState({page: 'signup'});
	},

	handleSignUpSuccess() {
		this.setState({page: 'login'});
	},

	render() {
		let content;

		if (this.state.page === 'login') {
			content = <LoginPage onLogin={this.handleLogin} onSignUp={this.handleSignUp} />;
		} else if (this.state.page === 'signup') {
			content = <SignUpPage onSignUpSuccess={this.handleSignUpSuccess} />;
		} else if (this.state.page === 'chat') {
			content = <ChatApp />;
		}

		return (
			<div>
				{content}
			</div>
		);
	}
});

React.render(<App/>, document.getElementById('app'));
