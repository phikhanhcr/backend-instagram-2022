import express from "express";
const route = express.Router();

import { messageRouter } from "./messageRoute";
import { conversationRouter } from "./conversation";
import { authRouter } from "./authRoute";
import { homeRouter } from "./homeRoute";
import { commentRouter } from "./commentRoute";
import { postRouter } from "./postRoute";
import { notificationRouter } from "./notificationRoute";
import { testRouter } from "./test";
let initialRouter = (app) => {
  authRouter(route, app);
  homeRouter(route, app);
  commentRouter(route, app);
  postRouter(route, app);
  notificationRouter(route, app);
  messageRouter(route, app);
  conversationRouter(route, app);

  testRouter(route, app);
};

export { initialRouter };
