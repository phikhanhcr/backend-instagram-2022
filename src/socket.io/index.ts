import notificationSocket from "./notification";

let initSocket = io => {
  io.use((socket, next) => {
    const currentUserId = socket.handshake.auth._id;
    if (!currentUserId) {
      return next(new Error("invalid userId"));
    }
    socket.currentUserId = currentUserId;
    next();
  });

  notificationSocket(io);
  
}

export default initSocket;