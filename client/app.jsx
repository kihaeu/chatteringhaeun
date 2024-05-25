// app.jsx
'use strict';

var React = require('react');
var ChatApp = require('./ChatApp.jsx');
var LoginPage = require('./LoginPage.jsx');
var SignUpPage = require('./SignUpPage.jsx');
var Sidebar = require('./Sidebar.jsx');
var MyPage = require('./MyPage.jsx');
var ChatSearch = require('./ChatSearch.jsx');

var App = React.createClass({
	getInitialState() {
		return {page: 'login', user: ''};
	},

	handleLogin(username) {
		this.setState({page: 'chatsearch', user: username});
	},

	handleSignUp() {
		this.setState({page: 'signup'});
	},

	handleSignUpSuccess() {
		this.setState({page: 'login'});
	},

	handleChangeName(newName) {
		this.setState({user: newName});
	},

	handleNavigate(page) {
		this.setState({page});
	},

	handleJoinRoom(roomId) {
		this.setState({page: 'chat', roomId});
	},

	render() {
		let content;

		if (this.state.page === 'login') {
			content = <LoginPage onLogin={this.handleLogin} onSignUp={this.handleSignUp} />;
		} else if (this.state.page === 'signup') {
			content = <SignUpPage onSignUpSuccess={this.handleSignUpSuccess} />;
		} else if (this.state.page === 'chat') {
			content = <ChatApp roomId={this.state.roomId} username={this.state.user} />;
		} else if (this.state.page === 'mypage') {
			content = <MyPage currentName={this.state.user} onChangeName={this.handleChangeName} />;
		} else if (this.state.page === 'chatsearch') {
			content = <ChatSearch onJoinRoom={this.handleJoinRoom} />;
		}

		return (
			<div>
				{this.state.page !== 'login' && this.state.page !== 'signup' && <Sidebar onNavigate={this.handleNavigate} />}
				{content}
			</div>
		);
	}
});

React.render(<App/>, document.getElementById('app'));
