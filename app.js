

// app.js
'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var socket = require('./routes/socket.js');

var app = express();
var server = http.createServer(app);

/* Configuration */
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', 3000);

// MySQL connection
var db_config = {
  host: 'localhost',
  user: 'chatuser',
  password: 'chatpassword',
  database: 'chatapp',
  port : 3307
};

var db;

function handleDisconnect() {
  db = mysql.createConnection(db_config); // 새로운 연결 생성

  db.connect((err) => {
    if (err) {
      console.log('Error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // 2초 후에 다시 시도
    } else {
      console.log('Connected to MySQL Database.');
    }
  });

  db.on('error', (err) => {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // 연결이 끊어졌을 경우
      handleDisconnect(); // 재연결
    } else {
      throw err;
    }
  });
}
handleDisconnect();
/* Development configuration */
if (process.env.NODE_ENV === 'development') {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

/* Socket.io Communication */
var io = require('socket.io').listen(server);
io.sockets.on('connection', socket);

// User registration endpoint
app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // Hash the password before storing it (add bcrypt or similar)
  var query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, password], function(err, results) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).send('Username already exists');
      } else {
        res.status(500).send('Error registering user');
      }
    } else {
      res.status(201).send('User registered successfully');
    }
  });
});

// User login endpoint
app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], function(err, results) {
    if (err) {
      res.status(500).send('Error logging in');
    } else if (results.length === 0) {
      res.status(401).send('Invalid username or password');
    } else {
      res.status(200).send('Login successful');
    }
  });
});

// User name change endpoint
app.post('/change-username', function(req, res) {
  var oldUsername = req.body.oldUsername;
  var newUsername = req.body.newUsername;
  console.log(oldUsername, newUsername);
  var query = 'UPDATE users SET username = ? WHERE username = ?';
  db.query(query, [newUsername, oldUsername], function(err, results) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).send('Username already exists');
      } else {
        res.status(500).send('Error changing username');
      }
    } else {
      res.status(200).send('Username changed successfully');
    }
  });
});

// Get chat rooms endpoint
app.get('/chat-rooms', function(req, res) {
  var query = 'SELECT * FROM chat_rooms';
  db.query(query, function(err, results) {
    if (err) {
      res.status(500).send('Error fetching chat rooms');
    } else {
      res.status(200).json(results);
    }
  });
});

// Create chat room endpoint
app.post('/chat-rooms', function(req, res) {
  var roomName = req.body.name;

  var query = 'INSERT INTO chat_rooms (name) VALUES (?)';
  db.query(query, [roomName], function(err, results) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).send('Chat room already exists');
      } else {
        res.status(500).send('Error creating chat room');
      }
    } else {
      res.status(201).send('Chat room created successfully');
    }
  });
});

// Get messages for a chat room
app.get('/chat-rooms/:id/messages', function(req, res) {
  var roomId = req.params.id;

  var query = 'SELECT * FROM messages WHERE chat_room_id = ?';
  db.query(query, [roomId], function(err, results) {
    if (err) {
      res.status(500).send('Error fetching messages');
    } else {
      res.status(200).json(results);
    }
  });
});

/* Start server */
server.listen(app.get('port'), function (){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;



