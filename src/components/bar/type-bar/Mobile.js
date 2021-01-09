import React from 'react';
import './style.css';

function  Mobile({totalUsers, totalRooms, currentRoom, setModals}) {

     return (
        <div className='Mobile'>
            <div className='mobile__bar__info'>
                <div className='bar__item'>
                    <img className='total__icon' src={process.env.PUBLIC_URL + '/icons/user-icon.png'} alt='icon' />
                    <div className='total__count'>{totalUsers}</div>
                </div>
                <div className='current__room__mob'>{currentRoom}</div>
                <div className='bar__item'>
                    <img className='total__icon' src={process.env.PUBLIC_URL + '/icons/door-icon.png'} alt='icon' />
                    <div className='total__count'>{totalRooms}</div>
                </div>
                
            </div>
            <div className='mobile__bar__action'>
                <div onClick={() => setModals(5)} className='button__action__mob'>users in the room</div>
                <div onClick={() => setModals(4)} className='button__action__mob'>change room</div>
            </div>
        </div>
     )
}

export default Mobile;