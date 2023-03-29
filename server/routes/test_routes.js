const express = require("express");
const UserService = require("../service/user_service");
const PeopleService = require("../service/people_service");
const router = express.Router();

router.get("/bearertest", async (req, res) => {
  res.send("Bearer test" + req.token);
});

router.get("/test/me", async (req, res, next) => {
  try {
    res.json(await UserService.getTokenBotUser(req.token));
  } catch (e) {
    next(e);
  }
});

router.get("/test/people/notionuserid/:notionUserId", async (req, res) => {
  const { notionUserId } = req.params;
  res.json(
    await PeopleService.getPeopleByNotionId(
      notionUserId,
      "native",
      process.env.NOTION_API_KEY_ID
    )
  );
});

module.exports = router;
