import notificationSocket from "./notification";

let initSocket = io => {
  notificationSocket(io);
  
}

export default initSocket;