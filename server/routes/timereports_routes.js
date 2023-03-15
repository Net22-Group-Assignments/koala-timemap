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
  const { schema } = req.query;
  let response;
  if (schema === "native") {
    const { date, person_id, hours, project_id, note } = req.body.time_report;
    response = await TimeReportsService.createReportWithNativeSchema(
      date,
      person_id,
      hours,
      project_id,
      note
    );
  } else {
    response = await TimeReportsService.createReport(req.body);
  }
  res.json(response);
});

module.exports = router;
