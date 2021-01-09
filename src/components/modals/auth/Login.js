import React, {useState} from 'react';
import './style.css';
import {URL} from '../../../global/config.js';

function Login({dispatch, mobile, setModals}) {

    const [valueName, setValueName] = useState('');
    const [valuePass, setValuePass] = useState('');
    const [error, setError] = useState(false);
    const [textError, setTextError] = useState('')

    const changeName = (e) => {
        if (error) {setError(false); setTextError('')};
        setValueName(e.target.value);
    }

    const changePass = (e) => {
        if (error) {setError(false); setTextError('')};
        setValuePass(e.target.value);
    }

    const cancelModal = () => {
        setModals(0);
        setValueName('');
        setValuePass('');
    }

    const loginAction = (e) => {
        e.preventDefault();
        if (valueName?.trim() === '' || valuePass?.trim() === '') {
            setError(true);
            setTextError('fill all fields');
            return;
        } else {
            fetch(`${URL}/login`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: valueName, password: valuePass})
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                } else if(response.status === 400) {
                    setError(true);
                    setTextError('Invalid USERNAME or PASSWORD, try again!');
                } 
            }).then((res) => {
                // res => {storeMessage, users, username, totalRooms, totalUsers}
                dispatch({type: 'CONNECT', data: res.username});
                dispatch({type: 'HISTORY_MESSAGE_ROOM', data: res.storeMessage});
                dispatch({type: 'USERS_IN_THE_ROOM', data: res.users});
                dispatch({type: 'LIST_ROOMS', data: res.rooms});
                dispatch({type: 'TOTAL_ROOMS', data: res.totalRooms});
                dispatch({type: 'TOTAL_USERS', data: res.totalUsers});
                setModals(0);
            }).catch((err) => { if (err) console.log(err) })
        }
    }
    
    return (
        <div className={mobile ? 'auth__mob' : 'auth__desc'}>
            <div className='auth__title'>Login</div>
            <form onSubmit={(e) => loginAction(e)} className='auth__form'>
                <div className='info__error'>{textError}</div>
                <div className='auth__input__wrapper'>
                    <div className='label__auth__input'>username</div>
                    <input type='text' onChange={(e) => changeName(e)} className={error ? 'auth__input error' : 'auth__input'} value={valueName} />
                </div>
                <div className='auth__input__wrapper'>
                    <div className='label__auth__input'>password</div>
                    <input type='password' onChange={(e) => changePass(e)} className={error ? 'auth__input error' : 'auth__input'} value={valuePass} />
                </div>
                <button className='auth__button'>login</button>
            </form>
            <div onClick={() => cancelModal()} className='modal__cancel'>cancel</div>
        </div>
    )
}

export default Login;