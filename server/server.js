const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
  res.json({ message: process.env.NOTION_OAUTH_CLIENT_ID });
});

app.get("/login/:code", async (req, res) => {
  const { code } = req.params;
  console.log(`code: ${code}`);
  const options = {
    method: "POST",
    url: "https://api.notion.com/v1/oauth/token",
    auth: {
      username: "dd6fae9a-921b-45b5-ab34-92e85932a89f",
      password: "secret_oUli5Gq6yc5cEHrEBfC1vj8HIAs0tCI5LndIoQXLtEX",
    },
    headers: { Accept: "application/json", "Content-type": "application/json" },
    data: {
      code: code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:3000",
    },
  };

  const response = await axios.request(options);
  res.json({ message: response.data.owner });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
