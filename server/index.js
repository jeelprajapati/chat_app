const path=require("path");
const express= require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server}= require("socket.io");
const io = new Server(server);
let userid={};
let staticpath=path.join(__dirname,"../client");
app.use(express.static(staticpath));
app.get('/', (req, res) => {
  res.sendFile(staticpath);
});

io.on('connection', (socket) => {
     socket.on('username',(user)=>{
         userid[socket.id]=user;
         socket.broadcast.emit('userjoined',user);  
         socket.on('sendmsg',function (massage) {
             socket.broadcast.emit('receive', { massage: massage, name: userid[socket.id]});
           })      
        socket.on('disconnect',(e)=>{
            socket.broadcast.emit('loseconnection',userid[socket.id])
        })
     })
});
server.listen(8000, () => {
  console.log('listening on *:8000');
});