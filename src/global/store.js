import { createStore, combineReducers } from 'redux';
import * as io from 'socket.io-client';
import {URL, userState, chatState} from './config.js';

const socket = io(URL, {autoConnect: false});

function userReducer(state = userState, action) {
  if (action.type === 'RECEIVE_PRIVATE_MESSAGE') {
    return {...state, privateMessage: [action.data, ...state.privateMessage]}
  } else if (action.type === 'CHANGE_ROOM') {   // after response from server
    return {...state, currentRoom: action.data}
  } else if (action.type === 'CONNECT') {
    socket.open();
    return {...state, isLogin: true, username: action.data}
  } else if (action.type === 'DISCONNECT') {
    socket.close();
    return userState;
  } else if (action.type === 'GET_SOCKET_ID') {
    return {...state, socketId: action.data}
  } else if (action.type === 'GET_OWN_ROOM') {
    return {...state, ownRoom: action.data}
  } else if (action.type === 'REMOVE_ROOM') {
    return {...state, ownRoom: action.data}
  } else {
    return state;
  }
}

function chatReducer(state = chatState, action) {
  if (action.type === 'RECEIVE_ROOM_MESSAGE') {
    return {...state, roomMessage: [...state.roomMessage, action.data]}
  } else if (action.type === 'TOTAL_ROOMS') {
    return {...state, totalRooms: action.data}
  } else if (action.type === 'TOTAL_USERS') {
    return {...state, totalUsers: action.data}
  } else if (action.type === 'USERS_IN_THE_ROOM') {   // after query login
    return {...state, users: action.data}
  } else if (action.type === 'EVENT_IN_THE_ROOM') {
    return {...state, users: action.data}
  } else if (action.type === 'SEND_ROOM_MESSAGE') {
    socket.emit(action.roomName, JSON.stringify({message: action.message, username: action.username}));
    return state;
  } else if (action.type === 'HISTORY_MESSAGE_ROOM') {   // after login or change room
    return {...state, roomMessage: action.data}
  } else if (action.type === 'ROOM_EVENT_IN_THE_CHAT') {   // after login or change room
    return {...state, rooms: action.data}
  } else if (action.type === 'LIST_ROOMS') {   // after login or change room
    return {...state, rooms: action.data}
  } else {
    return state;
  }  
}

const reducers = combineReducers({user: userReducer, chat: chatReducer});
let store = createStore(reducers);
export default store;

// FIRST REQUEST
fetch(`${URL}/relogin`, {
  method: 'GET',
  mode: 'cors',
  credentials: 'include'
}).then((response) => {
  if (response.ok) {
      return response.json();
  } else if(response.status === 401) {
      throw new Error('You must login!')
  }
}).then((res) => {
  // res => {storeMessage, users, username, totalRooms, totalUsers}
  store.dispatch({type: 'CONNECT', data: res.username});
  store.dispatch({type: 'HISTORY_MESSAGE_ROOM', data: res.storeMessage});
  store.dispatch({type: 'USERS_IN_THE_ROOM', data: res.users});
  store.dispatch({type: 'LIST_ROOMS', data: res.rooms});
  store.dispatch({type: 'TOTAL_ROOMS', data: res.totalRooms});
  store.dispatch({type: 'TOTAL_USERS', data: res.totalUsers});
}).catch((err) => { if (err) console.error(err) })


// ========  SOCKET LISTENERS  =========
// 1) 'connect'                    <- for get socket id
// 2) 'total rooms'                <- count all rooms in the chat
// 3) 'total users'                <- count all users in the chat
// 4) `${currentRoom} user event`  <- events in the room: came/gone user
// 5) 'event rooms'                <- events in the chat: remove/add room
// 6) `${socketId}`                <- receive private message

socket.on('connect', () => {store.dispatch({type: 'GET_SOCKET_ID', data: socket.id})});
socket.on('total rooms', (msg) => {store.dispatch({type: 'TOTAL_ROOMS', data: msg})});
socket.on('total users', (msg) => {store.dispatch({type: 'TOTAL_USERS', data: msg})});

const eventRoomsListener = async (msg) => {
  const mesObj = await JSON.parse(msg);  // {room: 'Any name room', action: 'remove/add'}
  const {chat} = store.getState();
  const tmpArrayRooms = mesObj.action === 'remove' ? chat.rooms.filter((item) => item !== mesObj.room) : [...chat.rooms, mesObj.room];
  store.dispatch({type: 'ROOM_EVENT_IN_THE_CHAT', data: tmpArrayRooms});
}
socket.on('event rooms', eventRoomsListener);

const eventUserListener = async (msg) => {
  const mesObj = await JSON.parse(msg); // {username: 'nick', action: 'remove/add'}
  const {chat} = store.getState();
  const tmpArrayUsers = mesObj.action === 'remove' ? chat.users.filter((item) => item !== mesObj.username) : [...chat.users, mesObj.username];
  store.dispatch({type: 'EVENT_IN_THE_ROOM', data: tmpArrayUsers});
}
const messageRoomListener = async (msg) => {
  const mesObj = await JSON.parse(msg);
  store.dispatch({type: 'RECEIVE_ROOM_MESSAGE', data: mesObj})
}
const privateMessageListener = async (msg) => { // {username: 'nick', message: 'any text', date: ''}
  const mesObj = await JSON.parse(msg);
  store.dispatch({type: 'RECEIVE_PRIVATE_MESSAGE', data: mesObj});
}
let curRoom = '';
let curSocketId = '';
let observer = false;
let observerSocket = false;
const handleChange = ({user} = store.getState()) => {
  const prevRoom = curRoom;
  const prevSocket = curSocketId;
  curRoom = user.currentRoom;
  curSocketId = user.socketId; 
  // The observer is useful in that it helps to call the listener only once. The observer instructs us to call the listener only once and remove the previous listener if the conditions are met.
    if (!observer && prevRoom === curRoom) {
      observer = true;
      socket.on(`${curRoom} user event`, eventUserListener)
      socket.on(curRoom, messageRoomListener);
    } else if (prevRoom !== curRoom) {    // if you change room, observer become - false; and remove before socket listener
      observer = false;
      socket.off(`${prevRoom} user event`, eventUserListener)
      socket.off(prevRoom, messageRoomListener);
    }
    if (!observerSocket && prevSocket === curSocketId) {
      observerSocket = true;
      socket.on(curSocketId, privateMessageListener);
    } else if (prevSocket !== curSocketId) {
      observerSocket = false;
      socket.off(prevSocket, privateMessageListener);
    }
}
store.subscribe(handleChange)   //    THIS FUNC HELP UPDATE CURRENT ROOM FOR SOCKET LISTENER






/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////   LOGIN AND LOGOUT AND REG   ////////////////////////////////
//            **********    POST REQUESTS   ***********
// app.post('/reg', (req, res))   // { username: 'nickName', password: '123456' }
// app.post('/login', (req, res))    // { username: 'nickName', password: '123456' } // req.session.name = req.body.username
// app.post('/logout', (req, res))    // req.session.destroy() // usersArray.REMOVEuser // roomsArray.REMOVEuser

///////////////////////////////   /LOGIN AND LOGOUT AND REG   ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

//       |----------------------------    LOGIC START APP
//       |
//         1) fetch('server/check-session') ===>> if (response.ok) ===>> get {username: 'YourNickName'} ===>> 
//         2) setUser({username: 'YourNickName', }) ===>> socket.open()
//         3) socket.on('connect', () => fetch('server/confirm', {body: {socketId: socket.id}})) ===>> 3
//         4) get after request ===>> 3) Info total room; 6) Total users in the room

//                  SERVER SIDE
//
//        after confirm user data, update socket listeners 5 and 7