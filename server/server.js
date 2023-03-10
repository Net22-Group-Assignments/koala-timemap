const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const storage = require("node-persist");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const swaggerDocumentPath = "./swagger.json";
const { Client } = require("@notionhq/client");
const { MockClient } = require("./mock.js");

dotenv.config();

const integrationArgIndex = process.argv.indexOf("--integration");
let integrationType;
if (integrationArgIndex > -1) {
  integrationType = process.argv[integrationArgIndex + 1];
}

let accessToken = null;
let notion = null;
let validToken = false;

const init = async () => {
  if (integrationType === "mock") {
    notion = MockClient;
    accessToken = "00000000-0000-0000-0000-000000000000";
    validToken = true;
    return;
  }

  if (integrationType === "internal" && !process.env.NOTION_API_KEY) {
    console.log("No internal access token in .env file");
    process.exit(1);
  }
  await storage.init();
  accessToken =
    integrationType === "public"
      ? await storage.getItem("access_token")
      : process.env.NOTION_API_KEY;
  console.log(`Access token: ${accessToken}`);
  if (accessToken != null) {
    notion = new Client({
      auth: accessToken,
    });
    try {
      const response = await notion.users.me();
      validToken = true;
      console.log("USER:");
      if (integrationType === "public") {
        console.log(response.bot.owner.user);
      } else {
        console.log(response);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.error(`Bearer Token ${accessToken} in storage not valid`);
        //await storage.removeItem("access_token");
      }
    }
  }
};

init();

const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

// Don't load swagger if no swagger.json file present.
if (fs.existsSync(swaggerDocumentPath)) {
  const swaggerDocument = require(swaggerDocumentPath);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Running with ${integrationType} Notion integration`);
});

app.get("/status", (req, res) => {
  res.json({
    integrationType: integrationType,
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
  try {
    const response = await notion.users.me();
    if (integrationType === "public") {
      res.json(response.bot.owner.user);
    } else {
      res.json(response);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    res.json(await notion.users.retrieve({ user_id: userId }));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/users", async (req, res) => {
  try {
    res.json(await notion.users.list());
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/projects", async (req, res) => {
  try {
    res.json(
      await notion.databases.query({
        database_id: process.env.PROJECT_DATABASE_ID,
      })
    );
  } catch (error) {
    console.error(error);
  }
});

app.post("/login", async (req, res) => {
  if (integrationType !== "public") {
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
    notion = new Client({
      auth: accessToken,
    });

    try {
      const user = await notion.users.me();
      validToken = true;
      console.log(`USER: ${user}`);
    } catch (error) {
      console.error(error);
    }
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
  if (integrationType !== "public") {
    res.status(400).send("Running with internal access token");
    return;
  }
  accessToken = null;
  validToken = false;
  notion = new Client();
  await storage.removeItem("access_token");
  console.log("Accesstoken removed");
  res.status(200).send("Accesstoken removed");
});
