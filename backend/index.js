var express = require('express')
var app = express()
var cors = require('cors')
var http = require('http').Server(app)
var socketConfig = require('./config');
var io = require('socket.io')(http, socketConfig)
var port = process.env.PORT || 8081
var sqlite = require('./loaders/sqlite')
const { saveMessage, retrieveMessages } = require('./services/message')
const { createUpdateRoom } = require('./services/room')

var database
var rooms = {}
var roomsCreatedAt = new WeakMap()
var names = new WeakMap()
var roomId
var name
var chatRoomMessages

app.use(cors())

app.get('/rooms/:roomId', (req, res) => {
  const { roomId } = req.params
  const room = rooms[roomId]

  if (room) {
    res.json({
      createdAt: roomsCreatedAt.get(room),
      users: Object.values(room).map(socket => names.get(socket))
    })
  } else {
    res.status(500).end()
  }
})

app.get('/rooms', (req, res) => {
  res.json(Object.keys(rooms))
})

io.on('connection', socket => {
  socket.on('join', async (_roomId, _name, callback) => {
    if (!_roomId || !_name) {
      if (callback) {
        callback('roomId and name params required')
      }
      console.warn(`${socket.id} attempting to connect without roomId or name`, { roomId, name })
      return
    }

    roomId = _roomId;
    name = _name;
    await createUpdateRoom(database, roomId)
    chatRoomMessages = await retrieveMessages(database, roomId)

    if (rooms[roomId]) {
      rooms[roomId][socket.id] = socket
    } else {
      rooms[roomId] = { [socket.id]: socket }
      roomsCreatedAt.set(rooms[roomId], new Date())
    }
    socket.join(roomId)

    names.set(socket, name)

    io.to(roomId).emit('system message', `${name} joined ${roomId}`)
    io.to(roomId).emit('room messages', chatRoomMessages)

    if (callback) {
      callback(null, { success: true })
    }
  })

  socket.on('chat message', msg => {
    io.to(roomId).emit('chat message', msg, name)
    saveMessage(database, roomId, msg, name)
  })

  socket.on('disconnect', () => {
    io.to(roomId).emit('system message', `${name} left ${roomId}`)

    delete rooms[roomId][socket.id]

    const room = rooms[roomId]
    if (!Object.keys(room).length) {
      delete rooms[roomId]
    }
  })
})

http.listen(port, '0.0.0.0', async () => {
  database = await sqlite();
  console.log('listening on *:' + port)
})
