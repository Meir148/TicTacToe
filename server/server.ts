import express from 'express';
// import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import { authMiddleware } from './authMiddleware';

let users = JSON.parse(fs.readFileSync('server/data.json').toString());
let games: any[] = [];

const app = express();
app.use(express.json());

app.post('/auth/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });
  fs.writeFileSync('server/data.json', JSON.stringify(users));
  res.status(201).send('User registered');
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u: any) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.status(200).send('Logged in');
});

// Game routes
app.get('/games', authMiddleware, (req: any, res) => {
  const username = req.user.username;
  const userGames = games.filter((game: any) => game.players.includes(username));
  res.json(userGames);
});

app.post('/games/start', authMiddleware, (req: any, res) => {
  const newGame = { id: Date.now(), players: [req.user.username], moves: [] };
  games.push(newGame);
  res.status(201).send(newGame);
});

// HTTP server and WebSocket setup
const server = createServer(app);
const io = new Server(server);

// WebSocket handling
io.on('connection', (socket) => {
  console.log('New WebSocket connection');
  
  socket.on('makeMove', (data) => {
    const { gameId, player, position } = data;
    const game = games.find(g => g.id === gameId);
    if (game) {
      game.moves.push({ player, position });
      io.emit('moveMade', { gameId, player, position });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
