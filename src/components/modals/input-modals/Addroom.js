import React, { useState } from 'react';
import './style.css';
import {URL} from '../../../global/config.js';

function Addroom({username, setModals, dispatch}) {

    const [val, setVal] = useState('');

    const freshVal = (e) => {
        setVal(e.target.value);
    }
    const createRoom = (e) => {
        e.preventDefault();
        if (val?.trim() === '') {setVal(''); return}
        const tmpName = val;
        fetch(`${URL}/actionroom`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({room: tmpName, username: username, action: 'add'})
        }).then((response) => {
            if (response.ok) {
                alert('Room created!');
                setModals(0);
                dispatch({type: 'GET_OWN_ROOM', data: tmpName});
            } else if(response.status === 401) {
                document.location.reload();
            }
        }).catch((err) => { if (err) console.log(err) })
    }
    
    return (
        <div className='Input__modal'>
            <form className='form__addroom' onSubmit={(e) => createRoom(e)}>
                <div className='title__private__form'>Create new room</div>
                <input onChange={(e) => freshVal(e)} className='input__add__room' value={val}  placeholder='Nameroom' maxLength='20' />
                <div className='wrapishe'>
                    <button onClick={(e) => {e.preventDefault(); setModals(0)}} className='send__private canceled'>cancel</button>
                    <button className='send__private'>create room</button>
                </div>
            </form>
        </div>
    )
}

export default Addroom;