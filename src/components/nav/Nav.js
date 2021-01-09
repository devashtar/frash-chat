import React, { useEffect, useState } from 'react';
import './style.css';
import {URL} from '../../global/config.js';

function Nav({barMenu, setBarMenu, privMes, isLogin, modals, setModals, dispatch}) {

    const [newMail, setNewMail] = useState(false);
    const [burger, setBurger] = useState(false);

    const switchUpBar = () => {
        setBarMenu(state => state ? false : true);
    }

    const burgerShow = () => {
        setBurger(state => state ? false : true);
    }

    const exitChat = () => {
        dispatch({type: 'DISCONNECT'});
        fetch(`${URL}/logout`, {method: 'POST', mode: 'cors', credentials: 'include'});
    }

    // modals 3 = list private messsages, if open, then don't 'setNewMail'
    useEffect(() => {
        if (privMes.length !== 0) {
            setNewMail(true);
        }
    }, [privMes])
    
    return (
        <div className='Nav'>
            {isLogin ? 
                <div className='bar__switcher'>
                    <div className={barMenu ? 'banner__title active' : 'banner__title'}>BAR</div>
                    <div className={barMenu ? 'switcher active' : 'switcher'} onClick={() => switchUpBar()}></div>
                </div>
                :
                <div className='empty'></div>
            }
            <div className='nav__inner__wrapper'>
                <div onClick={() => {setNewMail(false); setModals(3)}} className={isLogin ? 'nav__privmes show' : 'nav__privmes'}>
                    <div className={newMail ? 'privmes__wrapper active' : 'privmes__wrapper'}>
                        <img className='privmes__img' src={process.env.PUBLIC_URL + 'icons/envelope-line.png'} alt='mail'/>
                    </div>
                    <div className='privmes__count'>{privMes.length}</div>
                </div>
                <div className='burger__block' onClick={() => burgerShow()}>
                    <span className='line__burger'></span>
                </div>
            </div>
            <div className={burger ? 'inner__burger show' : 'inner__burger'}>
                    {isLogin ?
                        <div onClick={() => exitChat()} className='burger__item'>logout</div>
                        :
                        <>
                            <div onClick={() => {setModals(1); burgerShow()}} className='burger__item'>registration</div>
                            <div onClick={() => {setModals(2); burgerShow()}} className='burger__item'>login</div>
                        </>
                    }
                </div>
        </div>
    )
}

export default Nav;