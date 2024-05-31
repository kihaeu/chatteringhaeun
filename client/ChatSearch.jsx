'use strict';

var React = require('react');

var ChatSearch = React.createClass({
   getInitialState() {
      return { roomName: '', rooms: [] };
   },

   componentDidMount() {
      this.fetchChatRooms();
   },

   fetchChatRooms() {
      fetch('/chat-rooms')
         .then(response => response.json())
         .then(data => {
            this.setState({ rooms: data });
         })
         .catch(error => {
            console.error('Error fetching chat rooms:', error);
         });
   },

   handleChange(e) {
      this.setState({ roomName: e.target.value });
   },

   handleSubmit(e) {
      e.preventDefault();
      const existingRoom = this.state.rooms.find(room => room.name === this.state.roomName);
      if (existingRoom) {
         if (window.confirm('채팅방이 있습니다. 참여하시겠습니까?')) {
            this.props.onJoinRoom(existingRoom.id);
         }
      } else {
         if (window.confirm('채팅방이 없습니다. 생성하시겠습니까?')) {
            fetch('/chat-rooms', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({ name: this.state.roomName })
            })
            .then(response => {
               if (!response.ok) {
                  throw new Error('Error creating chat room');
               }
               return response.text();
            })
            .then(data => {
               alert(data);
               this.fetchChatRooms();
            })
            .catch(error => {
               alert('Error creating chat room: ' + error.message);
            });
         }
      }
   },

   render() {
      return (
         <div className="chat-search-container">
            <form onSubmit={this.handleSubmit} className="chat-search-form">
               <input
                  type="text"
                  placeholder="찾을 방"
                  value={this.state.roomName}
                  onChange={this.handleChange}
                  className="chat-search-input"
               />
               <button type="submit" className="chat-search-button">검색</button>
            </form>
            <h3>채팅방 목록</h3>
            <ul className="chat-room-list">
               {this.state.rooms.map(room => (
                  <li key={room.id} className="chat-room-item">
                     {room.name} <button onClick={() => this.props.onJoinRoom(room.id)} className="join-room-button">참여</button>
                  </li>
               ))}
            </ul>
         </div>
      );
   }
});

module.exports = ChatSearch;
