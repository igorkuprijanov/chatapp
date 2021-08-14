import React, {useEffect, useState, useRef} from 'react'
import './componentStyles.css'
import queryString from 'query-string'
import io from 'socket.io-client'
import Messages from './Messages.js'
import Peer from 'simple-peer'
import CopyToClipboard from 'react-copy-to-clipboard'
import {FaClipboard, FaArrowAltCircleUp, FaDoorOpen, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaSmile} from 'react-icons/fa'
import poster from './58201225_1.jpg'
import Picker from 'emoji-picker-react';
import {isMobileOnly} from 'react-device-detect'


let socket

const Main = ({location}) =>{
    
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [call, setCall] = useState(false)
    const [amount, setAmmount] = useState(null)
    const [sound, setSound] =useState(true)
    const [video, setVideo] = useState(true)
    const [emoji, setEmoji] = useState(false)
    
    const [stream, setStream] = useState(null)
    
    const ENDPOINT = 'https://hybrid-heaven-322709.ey.r.appspot.com/'
    //const ENDPOINT = 'http://localhost:5000'
    console.log(ENDPOINT)
    const myVideo = useRef()
    const userVideo = useRef()
    const peerRef = useRef()

    useEffect(() =>{
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });
        

        setName(queryString.parse(window.location.search).name)
        setRoom(queryString.parse(window.location.search).room)
        const {name, room} = queryString.parse(window.location.search)
        
        
        socket = io(ENDPOINT, {secure: true})
        socket.emit('join', ({name, room}), ()=>{
        
        })
        
        socket.on('recieveCall', (signalData)=>{
            recieveCall(signalData)
        })
        
        socket.on('info', (data)=>{
            
            setAmmount(data.length)
        })
        socket.on('overPopulation', ()=>{
            window.location.assign('../')
            window.alert('too many people')
        })
        
    }, [ENDPOINT, window.location.search])
    
    useEffect(()=>{
        socket.on('message', (message)=>{
            setMessages([...messages, message])
            if((/disconnected/.test(message.message)) && message.name === 'admin'){
                    userVideo.current.srcObject = null
                    setCall(false)
               }
        })
    }, [messages])
    
    
    useEffect(()=>{
        if(stream && amount===2){
            sendCall()
        }
    }, [stream])
    
    
  
    
    const changeSound = () =>{
        setSound(!sound)
    }
    useEffect(()=>{
        if(peerRef.current){
            peerRef.current.streams[0].getAudioTracks()[0].enabled = sound
        }
    }, [sound])
    
    const changeVideo = () =>{
        setVideo(!video)
    }
    
    useEffect(()=>{
        if(peerRef.current){
            peerRef.current.streams[0].getVideoTracks()[0].enabled = video
        }
    }, [video])
    
    
    useEffect(()=>{
        if(isMobileOnly){
            window.screen.orientation.lock('landscape')
        }
    })
    
    const sendMessage = (e) =>{
        e.preventDefault()
       
        if(message){
            socket.emit('sendMessage', {name, message}, room)
             setMessage('')
        }
    }
    
    const sendCall = () =>{
        
        const peer = new Peer({initiator: true, trickle: false, stream})
        peer.on('signal', (data)=>{
            socket.emit('callUser', {signalData: data, room: queryString.parse(window.location.search).room})
        })
        
         peer.on('stream', (streamData)=>{
             setCall(true)
            userVideo.current.srcObject = streamData
        })
    
        socket.on('callAccepted', (signalData)=>{
            peer.signal(signalData)
        })
        
        peerRef.current = peer
    }
    const recieveCall = (data) =>{
        
        console.log('im receiving a call')
        const peer = new Peer({initiator: false, trickle: false, stream: myVideo.current.srcObject})
        peer.on('signal', (data)=>{
            socket.emit('accept', {signalData: data, room: queryString.parse(window.location.search).room})
        })
        
        peer.on('stream', (streamData)=>{
            setCall(true)
            userVideo.current.srcObject = streamData
        })
        
        peer.signal(data)
        peerRef.current = peer
    }
    
    const leave = () =>{
        setCall(false)
        socket.emit('leave', ({name, room}))
        window.location.assign('../')
    }
    
    const onEmojiClick = (event, emojiObject) => {
        document.getElementById('textInput').value = document.getElementById('textInput').value + emojiObject.emoji
        setMessage(document.getElementById('textInput').value)
    }
    
    const selectEmoji = () =>{
        setEmoji(!emoji)
    }
    
    
    return(
    <div id='mainDiv'>
       <div id='topBar'></div>
       
       <div id='mainContentce'>
       <div id='videoContainerContainer'>
        <div id='videContainer'>
        <div id='myVideo'>
            <video className='video' playsInline muted ref={myVideo} autoPlay  poster={poster}/>
        </div>
        <div id='opponentVideo'>
            <video id='userVideo' className='video' playsInline ref={userVideo} autoPlay poster={poster}/>
        </div>
        </div>
         <div id='bottomBar'>
            {call 
                 ? 
                 <div className='videoControlsContainer'>
                 <button id='muteButton' onClick={changeSound} onMouseDown={(e)=>{document.getElementById('muteButton').style.backgroundColor = '#f88488'}} onMouseUp={(e)=>{document.getElementById('muteButton').style.backgroundColor = '#f65b60'}}>{sound ? <FaMicrophoneSlash  className='icon'/>  :  <FaMicrophone className='icon'/>}</button>
                 <button id='videoButton' onClick={changeVideo} onMouseDown={(e)=>{document.getElementById('videoButton').style.backgroundColor = '#f88488'}} onMouseUp={(e)=>{document.getElementById('videoButton').style.backgroundColor = '#f65b60'}}>{video ? <FaVideoSlash className='icon'/> : <FaVideo className='icon'/>}</button>
                 </div>
                 : 
             <div className='videoControlsContainer'>
                 <button id='muteButtonDisabled' style={{backgroundColor: "#9a9d9e"}}><FaMicrophoneSlash  className='icon' /></button>
                 <button id='videoButtonDisabled' style={{backgroundColor: "#9a9d9e"}}><FaVideoSlash className='icon' /></button>
            </div>
                 }
         </div>
        </div>
        
        <div id='chatContainer'>
        <div id='options'>
           
           <CopyToClipboard text={room}>
            <button id='roomButton' onMouseDown={(e)=>{document.getElementById('roomButton').style.backgroundColor = '#7081e8'}} onMouseUp={(e)=>{document.getElementById('roomButton').style.backgroundColor = '#4d62e3'}}>Room: {room}<FaClipboard className='icon' id='clipboardIcon'/></button>
            </CopyToClipboard>
            
            <button id='leaveButton' onClick={leave} onMouseDown={(e)=>{document.getElementById('leaveButton').style.backgroundColor = '#7081e8'}} onMouseUp={(e)=>{document.getElementById('leaveButton').style.backgroundColor = '#4d62e3'}}>Leave<FaDoorOpen className='icon' id='leaveIcon'/></button>
        </div>
        <div id='chat'>
            <div id='chatInner'>
            <Messages messages={messages}/>
            </div>
            {emoji ? <Picker onEmojiClick={onEmojiClick} pickerStyle={{ position: 'absolute', bottom: '8%', boxShadow: 'none', marginLeft: '1%'}}/> : null}
        <div id='input'>
            <form id='inputForm' onSubmit={sendMessage}>
              <div id='formInputContainer'>
              <div id='emojiPicker'>
               <FaSmile  id='emojiButton' onClick={selectEmoji} onMouseDown={(e)=>{document.getElementById('emojiButton').style.color = '#abadae'}} onMouseUp={(e)=>{document.getElementById('emojiButton').style.color = '#9a9d9e'}}/>
               </div>
                <input id='textInput' value={message} onChange={(e)=>{setMessage(e.target.value)}} type='text'/>
                </div>
                <button id='submitButton' type='submit' onMouseDown={(e)=>{document.getElementById('submitButton').style.backgroundColor = '#7081e8'}} onMouseUp={(e)=>{document.getElementById('submitButton').style.backgroundColor = '#4d62e3'}}><FaArrowAltCircleUp className='icon'/></button>
            </form>
            
        </div>
            </div>
        </div>
        </div>
       
    </div>
    )
}

export default Main

