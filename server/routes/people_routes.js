const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const PeopleService = require("../service/people_service");

const cache = apicache.middleware;
router.get("/people", cache("5 minutes"), async (req, res, next) => {
  req.apiCacheGroup = "people";
  const { schema } = req.query;
  try {
    res.json(await PeopleService.getPeople(null, schema, req.token));
  } catch (e) {
    next(e);
  }
});

router.get("/people/:peopleId", async (req, res, next) => {
  const { peopleId } = req.params;
  const { schema } = req.query;
  try {
    res.json(await PeopleService.getPeopleById(peopleId, schema, req.token));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
