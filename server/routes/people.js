const express = require("express");
const notionRequests = require("../notionRequests");
const router = express.Router();

router.get("/people", async (req, res) => {
  res.json(await notionRequests.getPeople());
});

router.get("/people/:peopleId", async (req, res) => {
  const { peopleId } = req.params;
  res.json(await notionRequests.getPeopleById(peopleId));
});

module.exports = router;
