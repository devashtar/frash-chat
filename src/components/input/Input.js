import React, { useState } from 'react';
import './style.css';
import {URL} from '../../global/config.js';

function Input({currentRoom, username, dispatch}) {
    
    const [value, setValue] = useState('');

    const changeValue = (e) => {
        setValue(e.target.value)
    }

    const sendChatRoomMessage = (e) => {
        e.preventDefault();
        if (value?.trim() === '') {setValue(''); return};
        fetch(`${URL}/message`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: value, room: currentRoom, username: username})
        }).then(async(response) => {
            if (response.status === 401) {
                document.location.reload();
            } else if (response.status === 400) {
                fetch(`${URL}/changeroom`, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({from: currentRoom, destination: 'MainRoom', username: username})
                }).then((response) => {
                    if (response.ok || response.status === 400) {
                        return response.json();
                    } else if(response.status === 401) {
                        document.location.reload();
                    }
                }).then((res) => {
                    // res => {storeMessage, users}
                    dispatch({type: 'CHANGE_ROOM', data: 'MainRoom'});
                    dispatch({type: 'HISTORY_MESSAGE_ROOM', data: res.storeMessage});
                    dispatch({type: 'USERS_IN_THE_ROOM', data: res.users});
                    alert('The room has been deleted, you are redirected to another room!');
                })
            }
        }).catch((err) => { if (err) console.log(err) })
        setValue('');
    }

    return (
        <div className='Input'>
            <form onSubmit={(e) => sendChatRoomMessage(e)} className='input__form'>
                <input className='input__input' type='text' onChange={(e) => changeValue(e)} value={value} />
                <button className='input__button'>Send</button>
            </form>
        </div>
    )
}

export default Input;
