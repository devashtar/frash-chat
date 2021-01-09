import React, { useEffect, useRef } from 'react';
import './style.css';

function Message({message}) {

    const refScroll = useRef(null);
    
    useEffect(() => {
        if (refScroll.current) {
            refScroll.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [message])
    
    return (
        <div className='Message'>
            {message.length === 0 ? '' :
                message.map((item, i) => {
                    return (
                        <div key={i} ref={refScroll} className={i % 2 ? 'message__item even' : 'message__item'}>
                            <div className='item__date'>{item.date}</div>
                            <div className='item__wrapper'>
                                <span className='item__username'>{item.username}</span>
                                <span className='item__content'>{item.message}</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Message;