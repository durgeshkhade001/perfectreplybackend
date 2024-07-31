let io;
const liveclients = new Map();

const init = (httpServer) => {
  const { Server } = require("socket.io");
  io = new Server(httpServer);

  io.on("connection", (socket) => {
    let clientId;

    const connectTimeout = setTimeout(() => {
      if (!clientId) {
        socket.disconnect();
      }
    }, 5000);

    socket.on("conn", (id) => {
      if (typeof id !== 'string' || id.trim() === '') {
        socket.emit("error", "Invalid client ID");
        return;
      }

      if (!clientId) {
        console.log("Client connected with id: " + id);
        clientId = id;
        liveclients.set(id, socket);
        io.emit("islive_" + clientId, true);
        clearTimeout(connectTimeout);
      }
    });

    socket.on("islive", (id) => {
      socket.emit("islive_" + id, liveclients.has(id));
    });

    socket.on("disconnect", () => {
      if (clientId) {
        liveclients.delete(clientId);
        io.emit("islive_" + clientId, false);
      }
    });
  });
};

const emitEvent = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  init,
  emitEvent,
};