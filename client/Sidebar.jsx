'use strict';

var React = require('react');

var Sidebar = React.createClass({
   render() {
      return (
         <div className="sidebar">
            <img src="images/twolion.png" alt="Logo" className="sidebar-logo" />
            <button 
               onClick={() => this.props.onNavigate('mypage')} 
               className={`sidebar-button ${this.props.currentPage === 'mypage' ? 'active' : ''}`}>
               <img src="images/user.png" alt="Logo" className="sidebar-logo" />
               <i className="fas fa-user"></i>
            </button>
            <button 
               onClick={() => this.props.onNavigate('chatsearch')} 
               className={`sidebar-button ${this.props.currentPage === 'chatsearch' ? 'active' : ''}`}>
               <img src="images/messages.png" alt="Logo" className="sidebar-logo" />
               <i className="fas fa-comments"></i>
            </button>
         </div>
      );
   }
});

module.exports = Sidebar;
