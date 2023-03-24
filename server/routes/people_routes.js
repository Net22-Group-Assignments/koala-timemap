const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const PeopleService = require("../service/people_service");

const cache = apicache.middleware;
router.get("/people", cache("5 minutes"), async (req, res) => {
  const { schema } = req.query;
  res.json(await PeopleService.getPeople(null, schema, req.token));
});

router.get("/people/:peopleId", async (req, res) => {
  const { peopleId } = req.params;
  const { schema } = req.query;
  res.json(await PeopleService.getPeopleById(peopleId, schema, req.token));
});

module.exports = router;
