const express = require("express");
const TimeReportsService = require("../service/timereports_service");
const router = express.Router();

router.get("/timereports", async (req, res) => {
  try {
    res.json(await TimeReportsService.getReports());
  } catch (error) {
    console.error(error);
  }
});

router.post("/timereports", async (req, res) => {
  const { date, person_id, hours, project_id, note } = req.body.time_report;
  res.json(
    await TimeReportsService.createReport(
      date,
      person_id,
      hours,
      project_id,
      note
    )
  );
});

module.exports = router;
