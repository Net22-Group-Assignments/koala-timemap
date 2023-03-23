const express = require("express");
const UserService = require("../service/user_service");
const router = express.Router();

router.get("/bearertest", async (req, res) => {
  res.send("Bearer test" + req.token);
});

router.get("/test/me", async (req, res) => {
  try {
    res.json(await UserService.getTokenBotUser(req.token));
  } catch (e) {
    if (e === "UNREGISTERED_TOKEN") {
      res.status(401).send("Unauthorized");
    }
  }
});

module.exports = router;
