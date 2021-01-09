import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {isMobile} from 'react-device-detect';
import {URL} from './global/config.js';
import './App.css';

import Nav from './components/nav/Nav.js';
import Bar from './components/bar/Bar.js';
import Message from './components/message/Message.js';
import Input from './components/input/Input.js';
import Modal from './components/modals/Modal.js';


function App({state, dispatch}) {

  const [mobile, setMobile] = useState(false);  // type device
  const [barMenu, setBarMenu] = useState(false);  // this uor orientir for size(height) of message block
  const [modals, setModals] = useState(0); //1-reg; 2-login; 3-listPrivmes; 4-listRooms; 5-listusers; 6-sendPrivMes; 7-addRoom; // by default: 0
  const [curRecipient, setCurRecipient] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {if (isMobile) setMobile(true)}, []);  // check type device

  useEffect(() => {
    if (!confirmed) {
      if (state.user.isLogin && state.user.socketId) {
        fetch(`${URL}/confirm`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({socketId: state.user.socketId})
        }).then((response) => {if (response.status === 401) {document.location.reload()}});
        setConfirmed(true);
      }
    }
}, [state.user, confirmed])

  const {users, totalUsers, totalRooms} = state.chat;
  const chatInfo = {users, totalUsers, totalRooms, setCurRecipient, ownRoom: state.user.ownRoom};

  return (
    <div className='App'>
      <div className='a'>
        <Nav barMenu={barMenu} setBarMenu={setBarMenu} privMes={state.user.privateMessage} isLogin={state.user.isLogin} modals={modals} setModals={setModals} dispatch={dispatch}/>
      </div>
      {state.user.isLogin &&
        <>
          <div className='b'>
            {barMenu && mobile && 
              <div className='wrapper__bar__mobile'>
                <Bar mobile={mobile} chatInfo={chatInfo} currentRoom={state.user.currentRoom} setModals={setModals} username={state.user.username} />
              </div>
            }
            <div className={barMenu && mobile ? 'wrapper__message fix' : 'wrapper__message'}>
            {barMenu && !mobile && 
              <div className='wrapper__bar__desctop'>
                <Bar mobile={mobile} chatInfo={chatInfo} currentRoom={state.user.currentRoom} setModals={setModals} username={state.user.username} />
              </div>}
            <div className='message__block'><Message message={state.chat.roomMessage}/></div>
            </div>
          </div>
        <div className='c'>
          <Input currentRoom={state.user.currentRoom} username={state.user.username} dispatch={dispatch} />
        </div>
        </>
      }
      {modals !== 0 && <Modal modals={modals} setModals={setModals} state={state} dispatch={dispatch} mobile={mobile} curRecipient={curRecipient} setCurRecipient={setCurRecipient}/>} 
    </div>
  )
}

export default connect(state => ({state}))(App)
