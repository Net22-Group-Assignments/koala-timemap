const express = require("express");
const PeopleService = require("../service/people_service");
const router = express.Router();

router.get("/people", async (req, res) => {
  const { simplify } = req.query;
  res.json(await PeopleService.getPeople(null, simplify));
});

router.get("/people/:peopleId", async (req, res) => {
  const { peopleId } = req.params;
  const { simplify } = req.query;
  res.json(await PeopleService.getPeopleById(peopleId, simplify));
});

module.exports = router;
