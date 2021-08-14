import React from 'react'
import './componentStyles.css'
import Message from './Message.js'
import ScrollToBottom from 'react-scroll-to-bottom'

const Messages = ({messages}) =>{
    return(
        <ScrollToBottom>
        <div id='chatBox'>
    
        {messages.map((message, i)=><Message key={i} name={message.name} text={message.message}/>)}
    
        </div>
        </ScrollToBottom>
    )
}

export default Messages

