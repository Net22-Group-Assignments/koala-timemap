const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const storage = require("node-persist");
const { getMe, getUser, getUsers } = require("./api");

dotenv.config();

let accessToken = null;
let userId = null; // TODO Should we store the notion user object or just the user id?

(async function () {
  await storage.init();
  accessToken = await storage.getItem("access_token");
  console.log(accessToken);
  if (accessToken != null) {
    try {
      const user = await getMe(accessToken);
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

app.get("/status", (req, res) => {
  res.json({ tokenRegistered: accessToken != null });
});

app.get("/clientId", (req, res) => {
  res.status(200).send(process.env.NOTION_OAUTH_CLIENT_ID);
});

// TODO Only for dev purpose, remove later.
app.get("/accessToken", (req, res) => {
  res.json({ accessToken: accessToken });
});

app.get("/me", async (req, res) => {
  res.json(await getMe(accessToken));
});

app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  res.json(await getUser(accessToken, userId));
});

app.get("/users", async (req, res) => {
  res.json(await getUsers(accessToken));
});

app.post("/login", async (req, res) => {
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
  } catch (error) {
    //console.log(error);
    if (data?.hasOwnProperty("error")) {
      res.status(500).send(data.error);
      return;
    }
    res.status(500).send("Major Malfunction with code " + code);
    return;
  }

  accessToken = data.access_token;
  await storage.setItem("access_token", accessToken);
  console.log(`access_token ${accessToken}`);

  res.json({ accessToken: accessToken });
});

app.post("/testLogin", async (req, res) => {
  const code = req.body.code;
  console.log(`code: ${code}`);
  accessToken = code;
  await storage.setItem("access_token", accessToken);
  console.log(`access_token ${accessToken}`);
  //res.json({ message: response.data.owner });
  res.status(200).send(`accesstoken: ${accessToken}`);
});

app.post("/logout", async (req, res) => {
  accessToken = null;
  await storage.removeItem("access_token");
  res.status(200).send("Accesstoken removed");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
