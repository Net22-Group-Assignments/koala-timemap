const express = require("express");
const PageService = require("../service/one_to_one_service");
const router = express.Router();

router
  .route("/pages/:pageId")
  .get(async (req, res) => {
    res.json(await PageService.RetrievePage(req.params.pageId));
  })
  .patch(async (req, res) => {
    res.json(await PageService.UpdatePage(req.params.pageId, req.body));
  });

// router.post("/projects", async (req, res) => {
//   res.json(await ProjectService.createProject(req.body));
// });

// router.get("/people/:peopleId", async (req, res) => {
//   const { peopleId } = req.params;
//   const { schema } = req.query;
//   res.json(await PeopleService.getPeopleById(peopleId, schema));
// });

module.exports = router;
