const express = require("express");
const notionRequests = require("../notionRequests");
const router = express.Router();

router.get("/me", async (req, res) => {
  res.json(await notionRequests.getTokenBotUser());
});

router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  res.json(await notionRequests.getNotionUserById(userId));
});

router.get("/users", async (req, res) => {
  res.json(await notionRequests.getNotionUsers());
});

module.exports = router;
