const userState = {
    isLogin: false,
    username: '',
    socketId: '',
    currentRoom: 'MainRoom',
    ownRoom: '',
    privateMessage: []   // {username: 'NickName', message: 'Any text', date: '25.12.2089 22:33:33'}
}
  
const chatState = {
    rooms: [],      //  ['MainRoom', 'Other room']
    users: [],      //  ['Jake', 'Jane', 'Mathew']
    totalUsers: 0,
    totalRooms: 0,
    roomMessage: []   // {username: 'NickName', message: 'Any text', date: '25.12.2089 22:33:33'}
}

const URL = 'https://limitless-meadow-52397.herokuapp.com';    // URL for socket and requests

export {URL, userState, chatState}