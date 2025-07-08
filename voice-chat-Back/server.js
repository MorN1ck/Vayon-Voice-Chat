const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});
app.use(cors(
  {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
));

const rooms = {};
// Генерация 5-значного кода комнаты (буквы и цифры)
function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

io.on('connection', (socket) => {
  socket.on('createRoom', (username) => {

    const roomCode = generateRoomCode();
    rooms[roomCode] = [];
    rooms[roomCode].push({id: socket.id, name: username});
  
    socket.join(roomCode);
    socket.emit('roomCreated', roomCode);
  });
  socket.on('joinRoom', ({ username, roomCode }) => {
    if (!rooms[roomCode]) {
      socket.emit('roomNotFound');
      return;
    }

    socket.join(roomCode);
    rooms[roomCode].push({ id: socket.id, name: username });
    socket.emit('userPush', roomCode);
    io.to(roomCode).emit('userJoined', username) //не работает не приходит возможно в том то что импортируется несколько сокет
  });
})


// Статическая папка для фронтенда
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));