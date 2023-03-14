const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const storage = require("node-persist");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const swaggerDocumentPath = "./swagger.json";
const { Client } = require("@notionhq/client");
const userRoutes = require("./routes/users");
const peopleRoutes = require("./routes/people");
const timeReportRoutes = require("./routes/timereports");
const { status } = require("./notionRequests");

dotenv.config();

const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

// Don't load swagger if no swagger.json file present.
if (fs.existsSync(swaggerDocumentPath)) {
  const swaggerDocument = require(swaggerDocumentPath);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/", userRoutes);
app.use("/api", peopleRoutes);
app.use("/api", timeReportRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Running with ${status.integrationType} Notion integration`);
});

app.get("/status", (req, res) => {
  res.json({
    ...status,
    client_id: process.env.NOTION_OAUTH_CLIENT_ID,
  });
});

app.get("/clientId", (req, res) => {
  res.status(200).send(process.env.NOTION_OAUTH_CLIENT_ID);
});

// TODO Only for dev purpose, remove later.
app.get("/accessToken", (req, res) => {
  res.json({ accessToken: accessToken });
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
