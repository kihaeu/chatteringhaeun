// routes/socket.js
var mysql = require('mysql');


// MySQL 연결
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
/* 기존 코드
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

*/

//username관련
var userNames = {};

var getUsersInRoom = function (room) {
  if (!userNames[room]) {
    return [];
  }
  return Object.keys(userNames[room]);
};

var freeName = function (room, name) {
  if (userNames[room] && userNames[room][name]) {
    delete userNames[room][name];
    if (Object.keys(userNames[room]).length === 0) {
      delete userNames[room];
    }
  }
};



module.exports = function (socket) {
  var name = null;
  var currentRoom = null;
  socket.on('join:room', function ({ userName, roomId }) {
    name = userName;
    currentRoom = roomId;

    console.log(currentRoom);


    if (!userNames[currentRoom]) {
      userNames[currentRoom] = {};
    }
    userNames[currentRoom][name] = true;

    socket.join(currentRoom);
  //새로운 사용자에게 자신의 이름과 사용자 목록 전송

  socket.emit('init', {
      name: name,
      users: getUsersInRoom(currentRoom),
    });

  //다른 클라이언트에게 새로운 사용자가 참여했음을 알림
    
    socket.broadcast.to(currentRoom).emit('user:join', {
      name: name,
    });
  });


  //사용자의 메시지를 다른 사용자에게 브로드캐스트
  socket.on('send:message', function (data) {
    var message = {
      username : name,
      text: data.text,
      created_at: new Date().toISOString()
    };
    socket.broadcast.to(currentRoom).emit('send:message', message);

    //메시지를 데이터베이스에 삽입
    var query = 'INSERT INTO messages (chat_room_id, username, text) VALUES (?, ?, ?)';
    db.query(query, [data.chat_room_id, name, data.text, message.created_at], function(err, results) {
      if (err) {
        console.error('Error inserting message into database: ', err);
      } else {
        console.log('Message inserted into database, ID:', results.insertId);
      }
    });
  });
/* 사용 안함

  //사용자의 이름 변경을 검증하고 성공 시 브로드캐스트
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
*/

  //사용자가 나가면 정리하고 다른 사용자에게 알림(완전 끈 거)
  socket.on('disconnect', function () {
    socket.broadcast.to(currentRoom).emit('user:left', {
      name: name,
    });
    freeName(currentRoom, name);
  });

  // 방을 나갔을 때 (chatapp componentWillUnmount 에서 사용)
  socket.on('leave:room', function ({ userName, roomId }) {
    freeName(roomId, userName);
    socket.leave(roomId);
    socket.broadcast.to(roomId).emit('user:left', {
      name: userName,
    });
  });
};
