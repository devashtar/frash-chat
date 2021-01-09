import React from 'react';
import './style.css';

import Reg from './auth/Reg.js';
import Login from './auth/Login.js';
import Listprivmes from './list/Listprivmes.js';
import Listrooms from './list/Listrooms.js';
import Listusers from './list/Listusers.js';
import Privmes from './input-modals/Privmes.js';
import Addroom from './input-modals/Addroom.js';

function Modal({modals, setModals, state, dispatch, mobile, curRecipient, setCurRecipient}) {
 //1-reg; 2-login; 3-listPrivmes; 4-listRooms; 5-listusers; 6-sendPrivMes; 7-addRoom;
    return (
        <div className='Modal'>
            {modals === 1 ? <Reg mobile={mobile} setModals={setModals} /> :
            modals === 2 ? <Login dispatch={dispatch} mobile={mobile} setModals={setModals} /> :
            modals === 3 ? <div className={mobile ? 'wrap__modal__mob' : 'wrap__modal__desc'}><Listprivmes message={state.user.privateMessage} setModals={setModals} /></div> :
            modals === 4 ? <div className={mobile ? 'wrap__modal__mob' : 'wrap__modal__desc'}><Listrooms state={state} dispatch={dispatch} setModals={setModals} /></div> :
            modals === 5 ? <div className='wrap__modal__mob'><Listusers users={state.chat.users} currentUser={state.user.username} setModals={setModals} setCurRecipient={setCurRecipient} /></div> :
            modals === 6 ? <div className={mobile ? 'wrap__modal__mob' : 'wrap__modal__desc'}><Privmes username={state.user.username} setModals={setModals} curRecipient={curRecipient} /></div> :
            modals === 7 ? <div className={mobile ? 'wrap__modal__mob' : 'wrap__modal__desc'}><Addroom username={state.user.username} setModals={setModals} dispatch={dispatch} /></div> : ''
            }
        </div>
    )
}

export default Modal;