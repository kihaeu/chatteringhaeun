'use strict';

var React = require('react');

var Sidebar = React.createClass({
   render() {
      return (
         <div className="sidebar">
            <img src="images/twolion.png" alt="Logo" className="sidebar-logo" />
            <button onClick={() => this.props.onNavigate('mypage')} className="sidebar-button">
				<img src="images/usericon.png" alt="Logo" className="sidebar-logo" />

               <i className="fas fa-user"></i>
            </button>
            <button onClick={() => this.props.onNavigate('chatsearch')} className="sidebar-button">
				<img src="images/message.png" alt="Logo" className="sidebar-logo" />

			   <i className="fas fa-comments"></i>
            </button>
         </div>
      );
   }
});

module.exports = Sidebar;
