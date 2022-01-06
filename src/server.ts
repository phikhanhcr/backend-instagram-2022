import { Server } from 'socket.io';
import express from "express"
import http from 'http';
const app = express();


import ConnectionDb from './db/connection';
import { initApp } from './app'
import env from "./config/env";
import initSocket from './socket.io';

const server = http.createServer(app);
const io = new Server(server);

ConnectionDb.connect();
initApp(app);


initSocket(io);

server.listen(env.app.port, () => console.log(`server is running on port ${env.app.port}`));
