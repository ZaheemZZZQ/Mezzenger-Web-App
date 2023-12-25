const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));


// Socket.io Setup
const io = require("socket.io")(server);
var Users = {};

io.on("connection", (socket) => {
    socket.on("New-User-Joined", (Username) => {
        Users[socket.id] = Username;
        socket.broadcast.emit('User-Connected', Username);
        io.emit("User-List", Users);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("User-Disconnected", User = Users[socket.id]);
        delete Users[socket.id];
        io.emit("User-List", Users);
    });

    socket.on('message', (Data) => {
        socket.broadcast.emit("message", { User: Data.User, Msg: Data.Msg });
    });

});





server.listen(port, () => {
    console.log("Server Started at Port " + port);
});




