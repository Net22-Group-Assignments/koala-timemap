const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const UserService = require("../service/user_service");

const cache = apicache.middleware;

router.get("users/me", async (req, res, next) => {
  try {
    res.json(await UserService.getTokenBotUser(req.token));
  } catch (e) {
    next(e);
  }
});

router.get(
  "/users/:userId", //cache("5 min"),
  async (req, res, next) => {
    const { userId } = req.params;
    try {
      res.json(await UserService.getNotionUserById(userId, req.token));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/users", //cache("5 minutes"),
  async (req, res, next) => {
    try {
      res.json(await UserService.getNotionUsers(req.token));
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
