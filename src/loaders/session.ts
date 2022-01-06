import session from 'express-session';
import MongoStore from 'connect-mongo';
import env from '../config/env';

let sessionStore = new MongoStore({
  mongoUrl : env.database.connection,
  autoRemove : "native",
})

const configSession = app => {
  app.use(session({
    key : "session-key",
    secret : "session",
    resave : true,
    store : sessionStore,
    saveUninitialized: false,
    cookie: {
      secure: true,
       maxAge : 1000 * 60 * 60 * 24 // 1 day
    }
  }))
}

export {
  configSession
}