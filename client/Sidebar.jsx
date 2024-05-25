// Sidebar.jsx
'use strict';

var React = require('react');

var Sidebar = React.createClass({
	render() {
		return (
			<div className="sidebar">
				<button onClick={() => this.props.onNavigate('mypage')}>마이페이지</button>
				<button onClick={() => this.props.onNavigate('chatsearch')}>채팅</button>
			</div>
		);
	}
});

module.exports = Sidebar;