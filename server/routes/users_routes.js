const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const UserService = require("../service/user_service");

const cache = apicache.middleware;

router.get("users/me", async (req, res) => {
  res.json(await UserService.getTokenBotUser());
});

router.get("/users/:userId", cache("5 min"), async (req, res) => {
  const { userId } = req.params;
  res.json(await UserService.getNotionUserById(userId));
});

router.get("/users", cache("5 minutes"), async (req, res) => {
  res.json(await UserService.getNotionUsers());
});

module.exports = router;
