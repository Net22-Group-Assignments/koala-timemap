const express = require("express");
const UserService = require("../service/user_service");
const PeopleService = require("../service/people_service");
const { generateOtp } = require("../service/otp_service");
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

// Test route to gnerate a one-time password
router.post("/test/otp", async (req, res, next) => {
  try {
    res.json(await generateOtp("123"));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
