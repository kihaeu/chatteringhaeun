'use strict';

var React = require('react');
var socket;

var UsersList = React.createClass({
   render() {
      return (
         <div className='users'>
            <h3> 참여자들 </h3>
            <ul>
               {
                  this.props.users.map((user, i) => {
                     return (
                        <li key={i}>
                           {user}
                        </li>
                     );
                  })
               }
            </ul>            
         </div>
      );
   }
});

var Message = React.createClass({
   render() {
      return (
         <div className="message">
            <strong>{this.props.username} :</strong> 
            <span>{this.props.text}</span>
            <div className="timestamp">{this.props.timestamp}</div>      
         </div>
      );
   }
});

var MessageList = React.createClass({
   render() {
      return (
         <div className='messages'>
            <h2> 채팅방 </h2>
            {
               this.props.messages.map((message, i) => {
                  return (
                     <Message
                        key={i}
                        username={message.username}
                        text={message.text}
                        timestamp={message.created_at} 
                     />
                  );
               })
            } 
         </div>
      );
   }
});

var MessageForm = React.createClass({
   getInitialState() {
      return {text: ''};
   },

   handleSubmit(e) {
      e.preventDefault();
      var message = {
         username: this.props.user, // 'user' 대신 'username' 사용
         text: this.state.text,
         chat_room_id: this.props.roomId,
         created_at: new Date().toISOString() // 메시지 전송 시간을 추가
      };
      this.props.onMessageSubmit(message);   
      this.setState({ text: '' });
   },

   changeHandler(e) {
      this.setState({ text : e.target.value });
   },

   render() {
      return(
         <div className='message_form'>
            <form onSubmit={this.handleSubmit}>
               <input
                  placeholder='메시지 입력'
                  className='textinput'
                  onChange={this.changeHandler}
                  value={this.state.text}
               />
               <h3></h3>
            </form>
         </div>
      );
   }
});

var ChatApp = React.createClass({
   getInitialState() {
      return {users: [], messages:[], text: '', roomId: this.props.roomId};
   },

   componentDidMount() {
      socket = io.connect('', { query: `username=${this.props.username}` });
      this.fetchMessages();
      socket.on('init', this._initialize);
      socket.on('send:message', this._messageRecieve);
      socket.on('user:join', this._userJoined);
      socket.on('user:left', this._userLeft);
      socket.on('change:name', this._userChangedName);
   },

   fetchMessages() {
      fetch(`/chat-rooms/${this.state.roomId}/messages`)
         .then(response => response.json())
         .then(data => {
            this.setState({ messages: data });
         })
         .catch(error => {
            console.error('Error fetching messages:', error);
         });
   },

   _initialize(data) {
      var {users, name} = data;
      this.setState({users, user: name});
   },

   _messageRecieve(message) {
      var {messages} = this.state;
      messages.push(message);
      this.setState({messages});
   },

   _userJoined(data) {
      var {users} = this.state;
      users.push(data.name);
      this.setState({users});
   },

   _userLeft(data) {
      var {users} = this.state;
      var index = users.indexOf(data.name);
      if (index !== -1) {
         users.splice(index, 1);
         this.setState({users});
      }
   },

   handleMessageSubmit(message) {
      var {messages} = this.state;
      messages.push(message);
      this.setState({messages});
      socket.emit('send:message', message);
   },

   handleChangeName(newName) {
      var oldName = this.state.user;
      socket.emit('change:name', { name : newName}, (result) => {
         if(!result) {
            return alert('There was an error changing your name');
         }
         var {users} = this.state;
         var index = users.indexOf(oldName);
         users.splice(index, 1, newName);
         this.setState({users, user: newName});
      });
   },

   render() {
      return (
         <div>
            <div className='center'>
               <UsersList users={this.state.users} />
               <MessageList messages={this.state.messages} />
               <MessageForm onMessageSubmit={this.handleMessageSubmit} user={this.state.user} roomId={this.state.roomId} />
            </div>
         </div>
      );
   }
});

module.exports = ChatApp;
