import { isAuthenticated } from '../utils/isAuthenticated'
let homeRouter = (route, app) => {

  route.get("/home", async (req, res) => {

    if(await isAuthenticated(req, res))  {
      res.send({message : "oke"})
    } else {
      res.send({message : "Fail login"})
    }
  })
  
  return app.use("/api", route);
}

export {
  homeRouter
}
