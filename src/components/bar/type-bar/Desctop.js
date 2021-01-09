import React from 'react';
import './style.css';

function Desctop({chatInfo, currentRoom, setModals, username, setCurRecipient}) {
 
    const sendToUser = (user) => {
        if (user === username) {
            return;
        } else {
            setCurRecipient(user);
            setModals(6);
        }
    }

    return (
        <div className='Desctop'>
            <div className='header__bar__desc'>
                <div className='desctop__bar__info'>
                    <div className='bar__item desc'>
                        <img className='total__icon' src={process.env.PUBLIC_URL + '/icons/user-icon.png'} alt='icon' />
                        <div className='total__count'>{chatInfo.totalUsers}</div>
                    </div>
                    <div className='bar__item desc'>
                        <img className='total__icon' src={process.env.PUBLIC_URL + '/icons/door-icon.png'} alt='icon' />
                        <div className='total__count'>{chatInfo.totalRooms}</div>
                    </div>
                </div>
                <div onClick={() => setModals(4)} className='button__bar__desc'>change room</div>
            </div>
            <div className='current__room__desc'>{currentRoom}{chatInfo.ownRoom === '' && <span onClick={() =>setModals(7)} className='add__room'>+</span>}</div>
            <div className='desctop__bar__users'>
                {chatInfo.users.length === 0 ? '' :
                    chatInfo.users.map((item, i) => {
                        return (
                            <div key={i} onClick={() => sendToUser(item)} className={item === username ? 'item__user__desc current' : 'item__user__desc'}>{item}</div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Desctop;