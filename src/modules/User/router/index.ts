import { Login } from "../handles";

const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  Login.getUser(req.user).then((r) => {
    res.json(r);
  });
});

export default router;
