import React from 'react';
import './style.css';

function Listprivmes({message, setModals}) {
    
    return (
        <>
            <div className='List__modal'>
                <div className='title__list'>Personal mail</div>
                    <div className='field__list'>
                        {message.length === 0 ? <div className='empty__list'>Empty</div> :
                            message.map((item, i) => {
                                return (
                                    <div key={i} className='list__item'>
                                        <div className='item__list__date'>{item.date}</div>
                                        <div className='item__list__wrapper'>
                                            <div className='item__list__username'>{item.username}</div>
                                            <div className='item__list__message'>{item.message}</div> 
                                        </div> 
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

export default Listprivmes;