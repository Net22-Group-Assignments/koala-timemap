const express = require("express");
const router = express.Router();
const ProjectService = require("../service/projects_service");

router.get("/projects", async (req, res) => {
  res.json(await ProjectService.getProjects());
});

router.post("/projects", async (req, res) => {
  res.json(await ProjectService.createProject(req.body));
});

module.exports = router;
