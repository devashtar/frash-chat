import React from 'react';
import './style.css';
import {URL} from '../../../global/config.js';

function Listrooms({state, dispatch, setModals}) {

    // {from: 'roomName', destination: 'roomName', username: 'name'}
    const changeRoom = (dest) => {
        if (state.user.currentRoom !== dest) {
            fetch(`${URL}/changeroom`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({from: state.user.currentRoom, destination: dest, username: state.user.username})
            }).then((response) => {
                if (response.ok || response.status === 400) {
                    return response.json();
                } else if(response.status === 401) {
                    document.location.reload();
                }
            }).then((res) => {
                // res => {storeMessage, users}
                dispatch({type: 'CHANGE_ROOM', data: dest});
                dispatch({type: 'HISTORY_MESSAGE_ROOM', data: res.storeMessage});
                dispatch({type: 'USERS_IN_THE_ROOM', data: res.users});
                setModals(0);
            }).catch((err) => { if (err) console.log(err) })
        } else {
            return
        }
    }
// {room: 'Any name room', username: 'room own' action: 'remove/add'}
    const removeRoom = (item) => {
        if (state.user.ownRoom === item) {
            fetch(`${URL}/actionroom`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({room: item, username: state.user.username, action: 'remove'})
            }).then((response) => {
                if (response.ok) {
                    console.log('room removed!');
                    dispatch({type: 'REMOVE_ROOM', data: ''});
                } else if(response.status === 401) {
                    document.location.reload();
                } else if (response.status === 400) {
                    throw new Error('Either is it NOT your OWN room or something went wrong')
                }
            }).catch((err) => { if (err) console.log(err) })
        } else {
            return
        }
        
    }
    
    return (
        <>
            <div className='List__modal'>
                <div className='title__list'>List of rooms{state.user.ownRoom === '' && <span onClick={() =>setModals(7)} className='add__room__mob'>add room</span>}</div>
                    <div className='field__list'>
                        {state.chat.rooms.length === 0 ? <div className='empty__list'>Empty</div> :
                            state.chat.rooms.map((item, i) => {
                                return (
                                    <div key={i} className='list__room__item'>
                                        <div onClick={() => changeRoom(item)} className={state.user.currentRoom === item ? 'item__list__dest current' : 'item__list__dest'}>{item}</div>
                                        {item === state.user.ownRoom && <div onClick={() => removeRoom(item)} className='ownroom'>X</div>}
                                    </div>
                                )
                            })
                        }    
                    </div>
            </div>
            <button onClick={() => setModals(0)} className='modal__list__cancel'>cancel</button>
        </>
    )
}

export default Listrooms;