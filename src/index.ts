import { Server } from "socket.io";
import express from "express";
import http from "http";
const app = express();

import ConnectionDb from "./db/connection";
import { initApp } from "./app";
import env from "./config/env";
import initSocket from "./socket.io";
const listEndpoints = require("express-list-endpoints");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

ConnectionDb.connect();
initApp(app);

app.set("io", io);

initSocket(io);

server.listen(env.app.port, () =>
  console.log(`server is running on port ${env.app.port}`)
);
