const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const storage = require("node-persist");
const { Client } = require("@notionhq/client");
const { MockClient } = require("./mock.js");

dotenv.config();

const integrationArgIndex = process.argv.indexOf("--integration");
let integrationValue;
if (integrationArgIndex > -1) {
  integrationValue = process.argv[integrationArgIndex + 1];
}

let accessToken = null;
let notion = null;
let validToken = false;

(async function () {
  if (integrationValue == "mock") {
    notion = MockClient;
    accessToken = "00000000-0000-0000-0000-000000000000";
    validToken = true;
    return;
  }

  if (integrationValue == "internal" && !process.env.NOTION_API_KEY) {
    console.log("No internal access token in .env file");
    process.exit(1);
  }
  await storage.init();
  accessToken =
    integrationValue == "public"
      ? await storage.getItem("access_token")
      : process.env.NOTION_API_KEY;
  console.log(accessToken);
  if (accessToken != null) {
    notion = new Client({
      auth: accessToken,
    });
    try {
      const user = await notion.users.me();
      validToken = true;
      console.log(user);
    } catch (error) {
      if (error.response.status == 401) {
        console.error(`Bearer Token ${accessToken} in storage not valid`);
        //await storage.removeItem("access_token");
      }
    }
  }
})();

const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.get("/status", (req, res) => {
  res.json({
    tokenRegistered: accessToken != null,
    validToken: validToken,
    clientId: process.env.NOTION_OAUTH_CLIENT_ID,
  });
});

app.get("/clientId", (req, res) => {
  res.status(200).send(process.env.NOTION_OAUTH_CLIENT_ID);
});

// TODO Only for dev purpose, remove later.
app.get("/accessToken", (req, res) => {
  res.json({ accessToken: accessToken });
});

app.get("/me", async (req, res) => {
  const response = await notion.users.me();
  if (integrationValue == "public") {
    res.json(response.bot.owner.user);
  } else {
    res.json(response);
  }
});

app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  res.json(await notion.users.retrieve({ user_id: userId }));
});

app.get("/users", async (req, res) => {
  res.json(await notion.users.list());
});

app.post("/login", async (req, res) => {
  if (integrationValue != "public") {
    res.status(400).send("Running with internal access token");
    return;
  }
  if (validToken) {
    res.status(400).send("Accesstoken already registered and validated");
    return;
  }

  const code = req.body.code;
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
    accessToken = data.access_token;
    await storage.setItem("access_token", accessToken);
    console.log(`access_token ${accessToken}`);

    res.status(200).end();
  } catch (error) {
    console.error(error.status);
    if (data?.hasOwnProperty("error")) {
      res.status(500).send(data.error);
      return;
    }
    res.status(500).end();
  }
});

app.post("/logout", async (req, res) => {
  if (integrationValue != "public") {
    res.status(400).send("Running with internal access token");
    return;
  }
  accessToken = null;
  validToken = false;
  notion = null;
  await storage.removeItem("access_token");
  res.status(200).send("Accesstoken removed");
});
