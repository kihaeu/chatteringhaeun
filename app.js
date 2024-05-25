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
var db = mysql.createConnection({
  host: 'localhost',
  user: 'chatuser',
  password: 'chatpw',
  database: 'chatdb'
});

db.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected to MySQL as id ' + db.threadId);
});

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

/* Start server */
server.listen(app.get('port'), function (){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
