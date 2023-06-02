import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import { getCurrentUser, userDisconnect, joinUser } from "./dummy_user.js";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    socket.on("joinRoom", function (roomName, username) {
        //* create user
        const user = joinUser(socket.id, username, roomName);
        socket.join(roomName);

        //display a welcome message to the user who have joined a room
        socket.emit("message", {
            userId: user.id,
            username: user.username,
            welcome: `Welcome ${user.username}`,
        });

        //displays a joined room message to all other room users except that particular user
        socket.broadcast.to(user.room).emit("message", {
            userId: user.id,
            username: user.username,
            join: `${user.username} has joined the chat`,
        });
    });

    //user sending message
    socket.on("chat", (dataMessage) => {
        //gets the room user and the message sent
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", { ...user, ...dataMessage });
    });

    socket.on("sendChatToServer", (message) => {
        socket.broadcast.emit("sendChatToClient", message);
    });

    socket.on("disconnect", () => {
        //the user is deleted from array of users and a left room message displayed
        const user = userDisconnect(socket.id);

        if (user) {
            io.to(user.room).emit("message", {
                userId: user.id,
                username: user.username,
                leave: `${user.username} has left the room`,
            });
        }
    });
});

httpServer.listen(process.env.PORT_SERVE_NODE || 4000, () => {
    console.log("Server is running");
});
