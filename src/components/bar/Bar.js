import React from 'react';
import './style.css';

import Mobile from './type-bar/Mobile.js';
import Desctop from './type-bar/Desctop.js';

function Bar({mobile, chatInfo, currentRoom, setModals, username}) {
    
    return (
        <div className='Bar'>
            {mobile ? 
                <Mobile totalUsers={chatInfo.totalUsers} totalRooms={chatInfo.totalRooms} currentRoom={currentRoom} setModals={setModals} /> 
                : 
                <Desctop chatInfo={chatInfo} currentRoom={currentRoom} setModals={setModals} username={username} setCurRecipient={chatInfo.setCurRecipient} />}
        </div>
    )
}

export default Bar;