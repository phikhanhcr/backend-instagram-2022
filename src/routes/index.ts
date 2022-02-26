import express from 'express';
const route = express.Router();

import { authRouter } from './authRoute';
import { homeRouter } from './homeRoute';
import { commentRouter } from './commentRoute'
import { postRouter } from './postRoute'
import { notificationRouter } from './notificationRoute'
let initialRouter = (app) => {
  
  authRouter(route, app);
  homeRouter(route, app);
  commentRouter(route, app);
  postRouter(route, app);
  notificationRouter(route, app);
  
}

export {
  initialRouter
}