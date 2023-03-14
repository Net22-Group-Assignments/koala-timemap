const express = require("express");
const notionRequests = require("../notionRequests");
const router = express.Router();

router.post("/timereports", async (req, res) => {
  const { date, person_id, hours, project_id, note } = req.body.time_report;
  res.json(
    await notionRequests.createReport(date, person_id, hours, project_id, note)
  );
});

module.exports = router;
