let testRouter = (route, app) => {
  // get post on new feeds
  route.get("/common", async (req, res) => {
    res.send({ message: "oke" });
  });
  return app.use("/local", route);
};

export { testRouter };
