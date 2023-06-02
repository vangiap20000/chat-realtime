import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import { getCurrentUser, userDisconnect, joinUser } from "./dummy_user.js";

const httpServer = createServer();
const io = new Server(httpServer, {
    // Cross-origin resource sharing. là một cơ chế cho phép nhiều tài nguyên khác nhau (fonts, Javascript, v.v…) của một trang web có thể được truy vấn từ domain khác với domain của trang đó
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    socket.on("joinRoom", function (roomName, username) {
        console.log(roomName);
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

// neu muon lay value tu file env thi dung process.env.PORT
httpServer.listen(process.env.PORT_SERVE_NODE || 4000, () => {
    console.log("Server is running");
});

//initializing the socket io connection
// io.on("connection", (socket) => {
//     //for a new user joining the room
//     socket.on("joinRoom", (username, roomName) => {
//         //* create user
//         const p_user = joinUser(socket.id, username, roomName);
//         console.log(socket.id, "=id");
//         socket.join(p_user.room);

//         //display a welcome message to the user who have joined a room
//         socket.emit("message", {
//             userId: p_user.id,
//             username: p_user.username,
//             text: `Welcome ${p_user.username}`,
//         });

//         //displays a joined room message to all other room users except that particular user
//         socket.broadcast.to(p_user.room).emit("message", {
//             userId: p_user.id,
//             username: p_user.username,
//             text: `${p_user.username} has joined the chat`,
//         });
//     });

//     //user sending message
//     socket.on("chat", (text) => {
//         //gets the room user and the message sent
//         const p_user = getCurrentUser(socket.id);

//         io.to(p_user.room).emit("message", {
//             userId: p_user.id,
//             username: p_user.username,
//             text: text,
//         });
//     });

//     //when the user exits the room
//     socket.on("disconnect", () => {
//         //the user is deleted from array of users and a left room message displayed
//         const p_user = userDisconnect(socket.id);

//         if (p_user) {
//             io.to(p_user.room).emit("message", {
//                 userId: p_user.id,
//                 username: p_user.username,
//                 text: `${p_user.username} has left the room`,
//             });
//         }
//     });
// });
