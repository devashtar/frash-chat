import React, { useState } from 'react';
import './style.css';
import {URL} from '../../../global/config.js';

function Privmes({username, setModals, curRecipient}) {

    const [textValue, setTextValue] = useState('');

    const onChangeText = (e) => {
        setTextValue(e.target.value)
    }

    const sendPrivate = (e) => {
        e.preventDefault();
        if (textValue?.trim() === '') {setTextValue(''); return}
        fetch(`${URL}/privmes`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sender: username, message: textValue, recipient: curRecipient})
        }).then((response) => {
            if (response.ok) {
                alert('Message succesfully sent!');
                setModals(0);  
            } else if(response.status === 401) {
                document.location.reload();
            } else if (response.status === 410) {
                alert('User not found! (Maybe was him removed or gone other room)');
                setModals(0);
            }
        }).catch((err) => { if (err) console.log(err) })
    }
    
    return (
        <div className='Input__modal'>
            <form className='form__private' onSubmit={(e) => sendPrivate(e)}>
                <div className='title__private__form'>Private message</div>
                <textarea onChange={(e) => onChangeText(e)} className='textarea' maxLength='2000' value={textValue}></textarea>
                <div className='wrapishe'>
                    <button onClick={(e) => {e.preventDefault(); setModals(0)}} className='send__private canceled'>cancel</button>
                    <button className='send__private'>Send</button>
                </div>
            </form>
        </div>
    )
}

export default Privmes;