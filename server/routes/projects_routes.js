const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const ProjectService = require("../service/projects_service");

const cache = apicache.middleware;

router.get("/projects", cache("5 minutes"), async (req, res) => {
  req.apicacheGroup = "projects";
  res.json(await ProjectService.getProjects());
});

router.post("/projects", async (req, res) => {
  apicache.clear("projects");
  res.json(await ProjectService.createProject(req.body));
});

module.exports = router;
