// Node server which will handle socket io connections
const io = require('socket.io')(8000, {
    cors : {
      origin : "*"  
    }
})

const users = {};

io.on('connection', socket =>{
    //  if any new users joins, let other connected users notify
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });

    // if someone sends message broadcast it to all connected users
    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // if any connected user disconnects/lefts the chat lets other connected users know
    socket.on('disconnect', message=>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

})