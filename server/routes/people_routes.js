const express = require("express");
const PeopleService = require("../service/people_service");
const router = express.Router();

router.get("/people", async (req, res) => {
  const { schema } = req.query;
  res.json(await PeopleService.getPeople(null, schema));
});

router.get("/people/:peopleId", async (req, res) => {
  const { peopleId } = req.params;
  const { schema } = req.query;
  res.json(await PeopleService.getPeopleById(peopleId, schema));
});

module.exports = router;
