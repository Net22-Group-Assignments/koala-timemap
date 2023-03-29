const express = require("express");
const LoginService = require("../service/login_service");
const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    if (process.env.INTEGRATION_TYPE === "internal-only") {
      res.json(await LoginService.createSignInResponse(process.env.GOD_ID));
    } else {
      const signInResponse = await LoginService.signIn(req.body.code);
      console.log("Sign in response");
      console.log(signInResponse);
      res.json(signInResponse);
    }
  } catch (e) {
    next(e);
  }
});

// The public integration is set to redirect to this route after the user has registered the integration
// with its Notion account. The code is passed as a query parameter.
router.get("/registertoken", async (req, res, next) => {
  console.log(req.query.code);
  try {
    const tokenInfo = await LoginService.registerToken(req.query.code);
    res.redirect(`http://localhost:3000?code=${tokenInfo.bot_id}`);
    // TODO - this is a hack to test to get the code to be passed back to the client. Remove this when done.
    // res.redirect(
    //   `http://localhost:3000?code=helloafterregistering&code=${req.query.code}`
    // );
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

// Route to list all tokens
router.get("/listtokens", async (req, res, next) => {
  try {
    res.json(await LoginService.getAllTokens());
  } catch (e) {
    next(e);
  }
});

module.exports = router;
