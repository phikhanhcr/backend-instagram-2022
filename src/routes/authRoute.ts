import { Authentication } from "../controllers"

let authRouter = (route, app) => {
  route.post("/login", Authentication.login)
  route.post("/register", Authentication.register)
  route.post("/get-user", Authentication.getUserByToken)
  
  return app.use("/api", route);
}

export {
  authRouter
}
