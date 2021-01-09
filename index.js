const app = require('express')();
const http = require('http').createServer(app);
const PORT = process.PORT || 4000;
const bodyParser = require('body-parser').json();
const session = require('express-session');
const CLIENT_URL = 'https://blooming-beach-21007.herokuapp.com';  // URL*

app.use(session({secret: 'mega secret word', saveUninitialized: true, resave: false, rolling: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }    
}));

app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials, access-control-allow-origin, Content-Type')
  .set('access-control-allow-origin', `${CLIENT_URL}`)
  .set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  .set('Access-Control-Allow-Credentials', 'true')
  .status(200).end();
});

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true')
  .set('access-control-allow-origin', `${CLIENT_URL}`);
  next(); 
});

const io = require('socket.io')(http, {
  cors: {
    origin: CLIENT_URL
  }
});


// let roomsArray = [{roomName: 'hall', users: ['NickName', 'OtherNick'], storeMessage: [{username: 'NickName', message: 'Any text', date: '25.12.2089 22:33:33'}], owner: 'NickName'}];
// let usersArray = [{username: 'NickName', socketId: socket.id}];
// let dataOfRegisteredUsers = [{username: 'NickName', password: '123456', regDate: '25.12.2089 22:33:33'}]
let roomsArray = [{roomName: 'MainRoom', users: [], storeMessage: [], owner: 'admin'}, {roomName: 'Palace', users: [], storeMessage: [], owner: 'John'}, {roomName: 'Other Room', users: [], storeMessage: [], owner: 'admin'}];    // by default has one room. This is 'MainRoom'
let usersArray = [];
let dataOfRegisteredUsers = [];
const maxLimitMessagesInTheRoom = 25;  // when length will peak 35 mes => clear 10 mes, up to 25

const checkLimitMessage = (indexRoom) => {
  if (roomsArray[indexRoom].storeMessage.length > (maxLimitMessagesInTheRoom + 10)) {  // you need to call this function less often
    roomsArray[indexRoom].storeMessage = roomsArray[indexRoom].storeMessage.slice(-maxLimitMessagesInTheRoom);
  }
}

const advertInChat = (room, username, action) => {
  io.emit('total rooms', roomsArray.length);
  io.emit('total users', usersArray.length);
  io.emit(`${room} user event`, JSON.stringify({username, action})) // {username: 'nick', action: 'remove/add'}
}
const addUserToChatRoom = (newUser, room) => {    // newUser 'string'
  const tmpIdx = roomsArray.findIndex((item) => item.roomName === room);
  roomsArray[tmpIdx].users.push(newUser);
  return true; 
}
const getDataForUser = async (username, room) => {
  const tmpIdx = await roomsArray.findIndex((item) => item.roomName === room);
  const histMes = await roomsArray[tmpIdx].storeMessage;    // array
  const usersInTheRoom = await roomsArray[tmpIdx].users;    // array
  return {storeMessage: histMes, users: usersInTheRoom, username: username, totalRooms: roomsArray.length, totalUsers: usersArray.length};
}
const userExit = (username) => {
  usersArray = usersArray.filter((item) => item.username !== username);
  const tmpIdx = roomsArray.findIndex((item) => item.users.includes(username));
  if (tmpIdx !== -1) {
    roomsArray[tmpIdx].users = roomsArray[tmpIdx].users.filter((item) => item !== username);
    advertInChat(roomsArray[tmpIdx].roomName, username, 'remove');
  }
}
const changeRoom = (from, destination, username) => {
  const tmpIdxFrom = roomsArray.findIndex((item) => item.roomName === from);
  if (tmpIdxFrom !== -1) {
    const tmpIdxDest = roomsArray.findIndex((item) => item.roomName === destination);
    roomsArray[tmpIdxFrom].users = roomsArray[tmpIdxFrom].users.filter((item) => item !== username);
    io.emit(`${roomsArray[tmpIdxFrom].roomName} user event`, JSON.stringify({username, action: 'remove'}));
    roomsArray[tmpIdxDest].users.push(username);
    io.emit(`${roomsArray[tmpIdxDest].roomName} user event`, JSON.stringify({username, action: 'add'}))
  } 
}
const roomAction = (room, username, action) => {
  if (action === 'add') {
    roomsArray.push({roomName: room, users: [], storeMessage: [], owner: username});
    io.emit('total rooms', roomsArray.length);
    io.emit('event rooms', JSON.stringify({room: room, action: 'add'}));
    return true;
  } else {
    const tmpIdx = roomsArray.findIndex((item) => item.owner === username);
    if (tmpIdx !== -1) {
      roomsArray = roomsArray.filter((o,i) => i !== tmpIdx);
      io.emit('total rooms', roomsArray.length);
      io.emit('event rooms', JSON.stringify({room: room, action: 'remove'}));
      return true;
    } else {
      return false;
    }
  }
}

app.post('/reg', bodyParser, (req, res) => {
  if (!!dataOfRegisteredUsers.find((item) => item.username === req.body.username)) {
    res.status(400).end();
  } else {
    dataOfRegisteredUsers.push({username: req.body.username, password: req.body.password, regDate: new Date().toLocaleString()})
    res.status(201).end();
  }
})

app.post('/login', bodyParser, async (req, res) => {
  if (!dataOfRegisteredUsers.find((item) => item.username === req.body.username && item.password === req.body.password)) {
    res.status(400).end();
  } else {
    req.session.name = req.body.username;
    const allRooms = roomsArray.map((item) => item.roomName);
    addUserToChatRoom(req.body.username, 'MainRoom');
    const infoObject = await getDataForUser(req.body.username, 'MainRoom');
    advertInChat('MainRoom', req.session.name, 'add');
    res.status(200).json({...infoObject, rooms: allRooms});
  }
})

app.get('/relogin', async (req, res) => {
  if (req.session.name) {
    const allRooms = roomsArray.map((item) => item.roomName);
    addUserToChatRoom(req.session.name, 'MainRoom');
    const infoObject = await getDataForUser(req.session.name, 'MainRoom');
    advertInChat('MainRoom', req.session.name, 'add');
    res.status(200).json({...infoObject, rooms: allRooms});
  } else {
    res.status(401).end();
  }
})

app.post('/confirm', bodyParser, (req, res) => {
  if (req.session.name) {
    usersArray = usersArray.map((item) => {
      if (item.socketId === req.body.socketId) {
        item.username = req.session.name;
        return item;
      } else {
        return item;
      }
    })
    res.status(201).end();
    io.emit('total rooms', roomsArray.length);
    io.emit('total users', usersArray.length);
  } else {
    res.status(401).end();
  }
})

app.post('/logout', (req, res) => {
  userExit(req.session.name);
  req.session.destroy();
  res.status(200).end();
})

app.post('/message', bodyParser, async (req, res) => { // {message: value, room: currentRoom, username: username}
  if (req.session.name) {
    const tmpIdx = roomsArray.findIndex((item) => item.roomName === req.body.room);
    const mesObj = {username: req.body.username, message: req.body.message, date: new Date().toLocaleString()}
    if (tmpIdx !== -1) {
      roomsArray[tmpIdx].storeMessage.push(mesObj)
      io.emit(req.body.room, JSON.stringify(mesObj));
      res.status(200).end();
      checkLimitMessage(tmpIdx);
    } else {
      res.status(400).end();
    }
  } else {
    res.status(401).end();
  }
})

app.post('/changeroom', bodyParser, async (req, res) => {
  if (req.session.name) {
    changeRoom(req.body.from, req.body.destination, req.body.username);
    const tmpIdx = await roomsArray.findIndex((item) => item.roomName === req.body.destination);
    const histMes = await roomsArray[tmpIdx].storeMessage;    // array
    const usersInTheRoom = await roomsArray[tmpIdx].users;    // array
    res.status(200).json({storeMessage: histMes, users: usersInTheRoom});  // same data like after login request
  } else {
    res.status(401).end();
  }
})
// {sender: 'Nickname', message: 'text', recipient: 'nickName', }
app.post('/privmes', bodyParser, (req, res) => {
  if (req.session.name) {
    const findPersonId = usersArray.find((item) => item.username === req.body.recipient);
    if (!!findPersonId) {
      io.emit(findPersonId.socketId, JSON.stringify({username: req.body.sender, message: req.body.message, date: new Date().toLocaleString()}));
      res.status(200).end();
    } else {
      res.status(410).end(); // user was remove before
    }
  } else {
    res.status(401).end();
  }
})
// {room: 'Any name room', username: 'room own' action: 'remove/add'}
app.post('/actionroom', bodyParser, async (req, res) => {
  if (req.session.name) {
    if (roomAction(req.body.room, req.body.username, req.body.action)) {
      res.status(200).end();
    } else {
      res.status(400).json();
    }
  } else {
    res.status(401).end();
  }
})

// ========= SOCKET LISTENERS ==========
const addSocketIdInArrayUsers = (id) => {
  console.log('connection: ', id);
  usersArray.push({username: '', socketId: id})
}  
const removeUserObjectInArrayUsers = (id) => {
  console.log('disconnect: ', id);
  const obj = usersArray.find((item) => item.socketId === id);
  if (!!obj.username) userExit(obj.username);
}
io.on('connect', (socket) => {
    addSocketIdInArrayUsers(socket.id)
    socket.on('disconnect', () => {
      removeUserObjectInArrayUsers(socket.id);
    })
})

http.listen(PORT);

// ========  SOCKET LISTENERS  =========
// 1) 'connect'                    <- for get socket id
// 2) 'total rooms'                <- count all rooms in the chat
// 3) 'total users'                <- count all users in the chat
// 4) `${currentRoom} user event`  <- events in the room: came/gone user
// 5) 'event rooms'                <- events in the chat: remove/add room
// 6) `${socketId}`                <- receive private message