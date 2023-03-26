const express = require("express");
const LoginService = require("../service/login_service");
const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    if (process.env.INTEGRATION_TYPE === "internal-only") {
      res.json(await LoginService.createSignInResponse(process.env.GOD_ID));
    } else {
      res.json(await LoginService.signIn(req.body.code));
    }
  } catch (e) {
    next(e);
  }
});

router.get("/registertoken", async (req, res, next) => {
  console.log(req.query.code);
  try {
    //const tokenInfo = LoginService.registerToken(req.query.code);
    //res.redirect(`http://localhost:3000?code=${tokenInfo.bot_id}`);
    res.redirect(
      `http://localhost:3000?code=helloafterregistering&code=${req.query.code}`
    );
  } catch (e) {
    next(e);
  }
});

// Route to delete all public tokens
router.delete("/deletepublictokens", async (req, res, next) => {
  try {
    res.json(await LoginService.deleteAllPublicTokens());
  } catch (e) {
    next(e);
  }
});

module.exports = router;
