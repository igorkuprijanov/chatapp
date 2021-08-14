import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import './componentStyles.css'
import {FaRedo} from 'react-icons/fa'

const Join = () =>{
    
    const [name, setName] = useState('')
    const [room, setRoom] = useState(Math.random().toString(36).substr(2, 9))
    
    useEffect(()=>{
        document.getElementById('idInput').value =room
    }, [room])
    
    
    const renewId = () =>{
        setRoom((Math.random().toString(36).substr(2, 9)))
    }
    
    const inputError = (event) =>{
        event.preventDefault()
        window.alert('Name and room can not be empty')
        }
    
    return(
    <div id='join'>
        <div id='joinIntroContainer'>
            <h1 className='text'>Welcome</h1>
            <h2 className='text'>Join a room!</h2>
        </div>
        
        <div id='inputContainer'>
        <div id='joinUsernameContainer'>
        <input className='joinInput' placeholder='Username' type='text' onChange={(e)=>{setName(e.target.value)}}/>
        </div>
        
        <div id='joinIdContainer'>
        <input className='joinInput' id='idInput' type='text'  onChange={(e)=>{setRoom(e.target.value)}} defaultValue={room}/>
        <FaRedo id='redoIcon' className='icon' onClick={renewId} onMouseDown={(e)=>{document.getElementById('redoIcon').style.color = 'lightgray'}} onMouseUp={(e)=>{document.getElementById('redoIcon').style.color = 'white'}}>renew id</FaRedo>
        </div>
        
        <div id='linkContainer'>
        <Link id='link' onClick={event=> (!name || !room) ? inputError(event) : null} to={`/main?name=${name}&room=${room}`}>
            <button id='joinButton' type='submit'>Enter</button>
        </Link>
        </div>
        </div>
        
        <div id='joinTextContainer'>
        <p className='text'>Enter your username and a room you would like to join.</p>
        <p className='text'>If the room does not exist it will be created and you'll be able to send an id to the person you'd like to join you.</p>
        <p className='text'>You can enter any username and call the room whatever you want.</p>
        <p className='text'>Happy chatting!</p>
        </div>
    </div>
    )
}

export default Join