import express from 'express';
const route = express.Router();

import { authRouter } from './authRoute';
import { homeRouter } from './homeRoute';

let initialRouter = (app) => {

  homeRouter(route, app);
  authRouter(route, app);
}

export {
  initialRouter
}