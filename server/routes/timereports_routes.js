const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const TimeReportsService = require("../service/timereports_service");

const cache = apicache.middleware;

router.get("/timereports", cache("5 minutes"), async (req, res) => {
  req.apicacheGroup = "timeReports";
  const { collated } = req.query;
  try {
    if (collated) {
      res.json(await TimeReportsService.getCollatedReports());
    } else {
      res.json(await TimeReportsService.getReports());
    }
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
  apicache.clear("timeReports");
  res.json(response);
});

module.exports = router;
