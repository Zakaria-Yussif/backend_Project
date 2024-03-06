
const connectedUsers = {};

function handleSocketIO(io) {
  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    // Event handler for setting userId
    socket.on('setUserId', (userId) => {
      // Store the userId along with the socket connection
      connectedUsers[userId] = socket.id;
      console.log("User connected with userId:", userId);

      socket.emit('connectedWithId', userId);
    });

    // Event handler for disconnection
    socket.on('disconnect', () => {
      for (const [key, value] of Object.entries(connectedUsers)) {
        if (value === socket.id) {
          delete connectedUsers[key];
          console.log("User disconnected with userId:", key);
          io.emit("callEnd"); // Inform all clients about the call ending
          break;
        }
      }
    });

    // Event handler for sending messages
    socket.on("send_message", (data) => {
      socket.broadcast.emit("received_message", data);
    });

    // Event handler for callUser
    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
    });

    // Event handler for answerCall
    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
    });

    // Emitting the socket ID to the client
    socket.emit("me", socket.id);

    // Function to check if a user is online
    socket.on("checkOnlineStatus", (id, callback) => {
      const isOnline = connectedUsers.hasOwnProperty(id);
      callback({ userId: id, isOnline });
      console.log("onlineStatus", { userId: id, isOnline });
    });
  });
}

module.exports = handleSocketIO;