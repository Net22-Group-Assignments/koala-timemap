const express = require("express");
const UserService = require("../service/user_service");
const router = express.Router();

router.get("/me", async (req, res) => {
  res.json(await UserService.getTokenBotUser());
});

router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  res.json(await UserService.getNotionUserById(userId));
});

router.get("/users", async (req, res) => {
  res.json(await UserService.getNotionUsers());
});

module.exports = router;
