const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const ProjectService = require("../service/projects_service");

const cache = apicache.middleware;

router.get("/projects", cache("5 minutes"), async (req, res, next) => {
  req.apicacheGroup = "projects";
  try {
    res.json(await ProjectService.getProjects(req.token));
  } catch (e) {
    next(e);
  }
});

router.post("/projects", async (req, res, next) => {
  apicache.clear("projects");
  try {
    res.json(await ProjectService.createProject(req.body, req.token));
  } catch (e) {
    next(e);
  }
});

router.get("/projects/statusvalues", async (req, res, next) => {
  req.apicacheGroup = "projects";
  try {
    res.json(await ProjectService.getProjectStatusValues());
  } catch (e) {
    next(e);
  }
});

module.exports = router;
