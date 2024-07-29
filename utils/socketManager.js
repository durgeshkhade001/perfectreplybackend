let io;

const init = (httpServer) => {
  const { Server } = require("socket.io");
  io = new Server(httpServer);
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
