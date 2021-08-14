const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const cors = require('cors')
const path = require('path')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js')

const app = express()
const server =http.createServer(app)
const io = socketio(server,
    {
    cors: {
        origin: '*',
        method: ["GET", "POST"]
    }})

app.use(cors())

const router = require('./router')

const PORT = process.env.PORT || 5000

app.use(express.static(path.resolve(__dirname, "./client/")))

io.on('connection', (socket)=>{
    //join function
    socket.on('join', ({name, room})=>{
        if(getUsersInRoom(room).length != 2){
            const {user} = addUser({id: socket.id, name, room})
            socket.join(room)
        
            socket.emit('info', getUsersInRoom(room))
            io.to(room).emit('message', ({name: 'admin', message: `User '${name}' has connected`}))
        }else{
            socket.emit('overPopulation')
        }
    })
    
    socket.on('callUser', ({signalData, room}) =>{
        io.to(getUsersInRoom(room)[0].id).emit('recieveCall', signalData)
    })
    
    socket.on('accept', ({signalData, room}) =>{
        io.to(getUsersInRoom(room)[1].id).emit('callAccepted', signalData)
    })
    
    
    //leave function
    socket.on('leave', ()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', {name: 'admin', message: `User '${user.name}' has disconnected`})
        }
    })
    
    //message function
    socket.on('sendMessage', ({name, message}, room)=>{
        io.to(room).emit('message', {name, message})
    })

})


app.use(router)

server.listen(PORT, ()=> console.log('server has started on port' + PORT))