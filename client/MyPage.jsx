'use strict';

var React = require('react');

var MyPage = React.createClass({
	getInitialState() {
		return { newName: '', currentName: this.props.currentName, newPassword: '' };
	},

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	},

	handleSubmit(e) {
		e.preventDefault();
		fetch('/change-credentials', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				oldUsername: this.state.currentName,
				newUsername: this.state.newName,
				newPassword: this.state.newPassword
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
			this.setState({ currentName: this.state.newName, newName: '', newPassword: '' });
			this.props.onChangeName(this.state.newName);
		})
		.catch(error => {
			alert('Error changing credentials: ' + error.message);
		});
	},

	handleLogout() {
		location.reload(); // 새로고침
	},

	render() {
		return (
			<div className="my-page">
				<h2>마이페이지</h2>
				<form onSubmit={this.handleSubmit} className="change-credentials-form">
					<input
						type="text"
						name="newName"
						placeholder="변경할 아이디 입력"
						value={this.state.newName}
						onChange={this.handleChange}
					/>
					<input
						type="password"
						name="newPassword"
						placeholder="변경할 비밀번호 입력"
						value={this.state.newPassword}
						onChange={this.handleChange}
					/>
					<button type="submit">변경 사항 저장</button>
				</form>
				<button onClick={this.handleLogout} className="logout-button">로그아웃</button>
			</div>
		);
	}
});

module.exports = MyPage;
