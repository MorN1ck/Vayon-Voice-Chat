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
    socket.username = username;
    socket.emit('roomCreated', roomCode);
    socket.emit('name', socket.username, socket.id);
    io.to(roomCode).emit('userUpdate', rooms[roomCode]);
  });

  socket.on('joinRoom', ({ username, roomCode }) => {
    if (!rooms[roomCode]) {
      socket.emit('roomNotFound');
      return;
    }

    socket.join(roomCode);
    socket.username = username;
    rooms[roomCode].push({ id: socket.id, name: username });

    socket.emit('userPush', roomCode);
    socket.emit('name', socket.username, socket.id);
    io.to(roomCode).emit('userUpdate', rooms[roomCode]);
  });

  socket.on('sendMessage', ({ roomCode, text }) => {
    const message = {
      username: socket.username,
      text,
      id: Date.now()
    };
    io.to(roomCode).emit('newMessage', message);
  });

  socket.on('signal', ({ to, signal }) => {
    io.to(to).emit('signal', { from: socket.id, signal });
  });

  socket.on('leaveRoom', ({ roomCode }) => {
    socket.leave(roomCode);

    if (rooms[roomCode]) {
      // Удаляем пользователя из массива комнаты
      rooms[roomCode] = rooms[roomCode].filter(user => user.id !== socket.id);

      // Обновляем пользователей в комнате
      io.to(roomCode).emit('userUpdate', rooms[roomCode]);

      // Если никого не осталось — удаляем комнату
      if (rooms[roomCode].length === 0) {
        delete rooms[roomCode];
      }
    }

  });
});


// Статическая папка для фронтенда
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));