const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const storage = require("node-persist");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const swaggerDocumentPath = "./swagger.json";
const { Notion } = require("./notion_client");
const UserService = require("./service/user_service");
const ProjectsService = require("./service/projects_service");
const TimeReportsService = require("./service/timereports_service");
const PeopleService = require("./service/people_service");
const integrationArgIndex = process.argv.indexOf("--integration");

dotenv.config();

let status = {
  integration_type: null,
  access_token: null,
  valid_token: false,
};

if (integrationArgIndex > -1) {
  status.integration_type = process.argv[integrationArgIndex + 1];
}

(async () => {
  if (status.integration_type !== "internal" && !process.env.NOTION_API_KEY) {
    console.log("No internal access token in .env file");
    process.exit(1);
  }
  status.access_token = process.env.NOTION_API_KEY;
  console.log(`Access token: ${status.access_token}`);
  Notion.configure(status.integration_type, status.access_token);
  UserService.configure(Notion);
  try {
    console.log(await UserService.getTokenBotUser());
    console.log("Valid internal token");
    status.valid_token = true;
  } catch (e) {
    console.error(e);
  }
  ProjectsService.configure(Notion);
  TimeReportsService.configure(Notion);
  PeopleService.configure(Notion);
})();

const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

// Don't load swagger if no swagger.json file present.
if (fs.existsSync(swaggerDocumentPath)) {
  const swaggerDocument = require(swaggerDocumentPath);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/api", require("./routes/users_routes"));
app.use("/api", require("./routes/people_routes"));
app.use("/api", require("./routes/timereports_routes"));
app.use("/api", require("./routes/projects_routes"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Running with ${status.integration_type} Notion integration`);
});

app.get("/api/status", (req, res) => {
  res.json({
    ...status,
    client_id: process.env.NOTION_OAUTH_CLIENT_ID,
  });
});

app.get("/api/clientId", (req, res) => {
  res.status(200).send(process.env.NOTION_OAUTH_CLIENT_ID);
});

// TODO Only for dev purpose, remove later.
app.get("/api/accessToken", (req, res) => {
  res.json({ accessToken: status.access_token });
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
