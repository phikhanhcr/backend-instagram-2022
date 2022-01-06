import { isAuthenticated } from '../utils/isAuthenticated'
let homeRouter = (route, app) => {

  route.get("/", async (req, res) => {
    console.log(await isAuthenticated(req, res)) 
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
