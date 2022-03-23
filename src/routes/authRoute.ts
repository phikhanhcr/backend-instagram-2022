import { Authentication } from "../controllers"
import { checkAuthentication } from '../middleware/checkAuthentication'
let authRouter = (route, app) => {
  route.post("/login", Authentication.login)
  route.post("/register", Authentication.register)
  route.post("/get-user", checkAuthentication, Authentication.getUserByToken)
  route.post("/get-access-token", Authentication.getAccessToken)

  return app.use("/api", route);
}

export {
  authRouter
}
