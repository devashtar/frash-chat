import React from 'react';
import './style.css';

function Listusers({users, currentUser, setModals, setCurRecipient}) {
    
    return (
        <>
            <div className='List__modal'>
                <div className='title__list'>List of users</div>
                    <div className='field__list'>
                        {users.length === 0 ? <div className='empty__list'>Empty</div> :
                            users.map((item, i) => {
                                return (
                                    <div key={i} className='list__user__item'>
                                        <div className={currentUser === item ? 'item__user current' : 'item__user'}>{item}</div>
                                        {item !== currentUser && <button onClick={() => {setCurRecipient(item); setModals(6)}} className='sender__private__mes'>send mail</button>}
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

export default Listusers;