// routes/socket.js
var mysql = require('mysql');

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

var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  var get = function () {
    var res = [];
    for (var user in names) {
      res.push(user);
    }
    return res;
  };

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

module.exports = function (socket) {
  var name = socket.handshake.query.username || userNames.getGuestName();
  userNames.claim(name);

  // send the new user their name and a list of users
  socket.emit('init', {
    name: name,
    users: userNames.get()
  });

  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    name: name
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    var message = {
      user: name,
      text: data.text
    };
    socket.broadcast.emit('send:message', message);

    // Insert message into the database
    var query = 'INSERT INTO messages (chat_room_id, user_id, text) VALUES (?, (SELECT id FROM users WHERE username = ?), ?)';
    db.query(query, [data.chat_room_id, name, data.text], function(err, results) {
      if (err) {
        console.error('Error inserting message into database: ', err);
      } else {
        console.log('Message inserted into database, ID:', results.insertId);
      }
    });
  });

  // validate a user's name change, and broadcast it on success
  socket.on('change:name', function (data, fn) {
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);

      name = data.name;
      
      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });

      fn(true);
    } else {
      fn(false);
    }
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
  });
};
