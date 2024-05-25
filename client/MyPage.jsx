// MyPage.jsx
'use strict';

var React = require('react');

var MyPage = React.createClass({
	getInitialState() {
		return {newName: '', currentName: this.props.currentName};
	},

	handleChange(e) {
		this.setState({ newName: e.target.value });
	},

	handleSubmit(e) {
		e.preventDefault();
		fetch('/change-username', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				oldUsername: this.state.currentName,
				newUsername: this.state.newName
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
			this.setState({ currentName: this.state.newName, newName: '' });
			this.props.onChangeName(this.state.newName);
		})
		.catch(error => {
			alert('Error changing username: ' + error.message);
		});
	},

	render() {
		return (
			<div className="my-page">
				<h2>마이페이지</h2>
				<form onSubmit={this.handleSubmit}>
					<input
						type="text"
						placeholder="변경할 아이디 입력"
						value={this.state.newName}
						onChange={this.handleChange}
					/>
					<button type="submit">아이디 변경</button>
				</form>
			</div>
		);
	}
});

module.exports = MyPage;
