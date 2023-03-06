const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const storage = require("node-persist");

dotenv.config();

let access_token = null;

(async function () {
  await storage.init();
  access_token = storage.getItem("access_token");
})();

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.text());

const status = { tokenRegistered: access_token !== null };

app.get("/status", (req, res) => {
  res.json({ status });
});
app.get("/clientId", (req, res) => {
  res.status(200).send(process.env.NOTION_OAUTH_CLIENT_ID);
});

app.get("/accessToken", (req, res) => {
  res.status(200).send(access_token);
});

app.post("/login", async (req, res) => {
  const code = req.body;
  console.log(`code: ${code}`);
  const options = {
    method: "POST",
    url: "https://api.notion.com/v1/oauth/token",
    auth: {
      username: process.env.NOTION_OAUTH_CLIENT_ID,
      password: process.env.NOTION_OAUTH_CLIENT_SECRET,
    },
    headers: { "Content-type": "application/json" },
    data: {
      grant_type: "authorization_code",
      code: code,
    },
  };
  console.log(options);
  let data = null;
  try {
    const response = await axios.request(options);
    data = response.data;
  } catch (error) {
    //console.log(error);
    if (data?.hasOwnProperty("error")) {
      res.status(500).send(data.error);
      return;
    }
    res.status(500).send("Major Malfunction with code " + code);
    return;
  }

  access_token = data.access_token;
  await storage.setItem("access_token", access_token);
  status.tokenRegistered = true;
  console.log(`access_token ${access_token}`);
  res.json({ message: data.owner });
  //res.status(200).send(`accesstoken: ${access_token}`);
});

app.post("/testLogin", async (req, res) => {
  const code = req.body;
  console.log(`code: ${code}`);
  access_token = code;
  await storage.setItem("access_token", access_token);
  status.tokenRegistered = true;
  console.log(`access_token ${access_token}`);
  //res.json({ message: response.data.owner });
  res.status(200).send(`accesstoken: ${access_token}`);
});

app.post("/logout", async (req, res) => {
  access_token = null;
  await storage.removeItem("access_token");
  status.tokenRegistered = false;
  res.status(200).send("Accesstoken removed");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
