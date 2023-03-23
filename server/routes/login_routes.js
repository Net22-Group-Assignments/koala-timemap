const express = require("express");
const LoginService = require("../service/login_service");
const router = express.Router();

router.post("/login", async (req, res) => {
  if (process.env.INTEGRATION_TYPE === "internal-only") {
    res.json(await LoginService.createSignInResponse(process.env.GOD_ID));
  }
});

module.exports = router;

// app.post("/login", async (req, res) => {
//   if (integrationType !== "public") {
//     res.status(400).send("Running with internal access token");
//     return;
//   }
//   if (validToken) {
//     res.status(400).send("Accesstoken already registered and validated");
//     return;
//   }
//
//   const code = req.body.code;
//   console.log(`code: ${code}`);
//   const options = {
//     method: "POST",
//     url: "https://api.notion.com/v1/oauth/token",
//     auth: {
//       username: process.env.NOTION_OAUTH_CLIENT_ID,
//       password: process.env.NOTION_OAUTH_CLIENT_SECRET,
//     },
//     headers: { "Content-type": "application/json" },
//     data: {
//       grant_type: "authorization_code",
//       code: code,
//     },
//   };
//   console.log(options);
//   let data = null;
//   try {
//     const response = await axios.request(options);
//     data = response.data;
//     accessToken = data.access_token;
//     notion = new Client({
//       auth: accessToken,
//     });
//
//     try {
//       const user = await notion.users.me();
//       validToken = true;
//       console.log(`USER: ${user}`);
//     } catch (error) {
//       console.error(error);
//     }
//     await storage.setItem("access_token", accessToken);
//     console.log(`access_token ${accessToken}`);
//
//     res.status(200).end();
//   } catch (error) {
//     console.error(error.status);
//     if (data?.hasOwnProperty("error")) {
//       res.status(500).send(data.error);
//       return;
//     }
//     res.status(500).end();
//   }
// });
//
// app.post("/logout", async (req, res) => {
//   if (integrationType !== "public") {
//     res.status(400).send("Running with internal access token");
//     return;
//   }
//   accessToken = null;
//   validToken = false;
//   notion = new Client();
//   await storage.removeItem("access_token");
//   console.log("Accesstoken removed");
//   res.status(200).send("Accesstoken removed");
// });
