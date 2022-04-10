let homeRouter = (route, app) => {

  route.get("/home", async (req, res) => {
    res.send({ message: "oke" })
  })

  return app.use("/api", route);
}

export {
  homeRouter
}
