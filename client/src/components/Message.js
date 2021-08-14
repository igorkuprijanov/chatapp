import React from 'react'
import './componentStyles.css'
import queryString from 'query-string'

const Message = ({name, text}) =>{
    
    
    const isMe = (name) =>{
        if(queryString.parse(window.location.search).name === name){
            return true
        }
    }
   
    return(
    <div id='messageContainer' className={isMe(name) ? 'myMessage' :  (name === 'admin') ?  'adminsMessage' : 'opponentsMessage'}>
        <p id='messageText'>{text}</p>
    </div>
    )
}

export default Message