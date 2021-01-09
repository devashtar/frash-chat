import React, { useState } from 'react';
import './style.css';
import {URL} from '../../../global/config.js';

function Reg({mobile, setModals}) {

    const [valueName, setValueName] = useState('');
    const [valuePass, setValuePass] = useState('');
    const [valueDoublePass, setValueDoublepass] = useState('');
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
    const changeDoublePass = (e) => {
        if (error) {setError(false); setTextError('')};
        setValueDoublepass(e.target.value);
    }

    const cancelModal = () => {
        setModals(0);
        setValueName('');
        setValuePass('');
        setValueDoublepass('');
    }

    const regAction = (e) => {
        e.preventDefault();
        if (valueName?.trim() === '' || valuePass?.trim() === '' || valueDoublePass?.trim() === '') {
            setError(true);
            setTextError('fill all fields');
            return;
        } else if (valuePass !== valueDoublePass) {
            setError(true);
            setTextError('passwords do not match, check fields with passwords!');
            return;
        } else {
            fetch(`${URL}/reg`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: valueName, password: valuePass})
            }).then((response) => {
                if (response.ok) {
                    setModals(2);
                } else if(response.status === 400) {
                    setError(true);
                    setTextError('this USERNAME is already in use, please think of another USERNAME!');
                    setValuePass('');
                    setValueDoublepass('');
                } 
            }).catch((err) => { if (err) console.log(err) })
        }
    }
    
    return (
        <div className={mobile ? 'auth__mob' : 'auth__desc'}>
            <div className='auth__title'>Registration</div>
            <form onSubmit={(e) => regAction(e)} className='auth__form'>
                <div className='info__error'>{textError}</div>
                <div className='auth__input__wrapper'>
                    <div className='label__auth__input'>username</div>
                    <input type='text' onChange={(e) => changeName(e)} className={error ? 'auth__input error' : 'auth__input'} value={valueName} />
                </div>
                <div className='auth__input__wrapper'>
                    <div className='label__auth__input'>password</div>
                    <input type='password' onChange={(e) => changePass(e)} className={error ? 'auth__input error' : 'auth__input'} value={valuePass} />
                </div>
                <div className='auth__input__wrapper'>
                    <div className='label__auth__input'>password</div>
                    <input type='password' onChange={(e) => changeDoublePass(e)} className={error ? 'auth__input error' : 'auth__input'} value={valueDoublePass} />
                </div>
                <button className='auth__button'>register</button>
            </form>
            <div onClick={() => cancelModal()} className='modal__cancel'>cancel</div>
        </div>
    )
}

export default Reg;