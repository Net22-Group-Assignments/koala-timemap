const express = require("express");
const apicache = require("apicache");
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
const LoginService = require("./service/login_service");
const morgan = require("morgan");
const integrationArgIndex = process.argv.indexOf("--integration");

dotenv.config();

let status = {
  integration_type: null,
  access_token: null,
  valid_token: false,
};

if (integrationArgIndex > -1) {
  status.integration_type = process.argv[integrationArgIndex + 1];
  process.env.INTEGRATION_TYPE = "internal";
}

(async () => {
  if (status.integration_type !== "internal" && !process.env.NOTION_API_KEY) {
    console.log("No internal access token in .env file");
    process.exit(1);
  }
  status.access_token = process.env.NOTION_API_KEY;
  console.log(`Access token: ${status.access_token}`);
  status.valid_token = await Notion.configure(
    status.integration_type,
    status.access_token
  );
  if (!status.valid_token) {
    console.error("Invalid internal token");
  }
  console.log("Valid internal token");
  UserService.configure(Notion);
  ProjectsService.configure(Notion);
  TimeReportsService.configure(Notion);
  PeopleService.configure(Notion);
  LoginService.configure(Notion);
})();

const PORT = 3001;

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Don't load swagger if no swagger.json file present.
if (fs.existsSync(swaggerDocumentPath)) {
  const swaggerDocument = require(swaggerDocumentPath);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/api", require("./routes/users_routes"));
app.use("/api", require("./routes/people_routes"));
app.use("/api", require("./routes/timereports_routes"));
app.use("/api", require("./routes/projects_routes"));
app.use("/api", require("./routes/login_routes"));

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
