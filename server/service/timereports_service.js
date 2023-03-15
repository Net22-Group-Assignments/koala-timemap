const dotenv = require("dotenv");
const TimeReport = require("../timemap_objects");
const { Notion } = require("../notion_client");
dotenv.config();
const timeReportsDB = process.env.TIMEREPORTS_DATABASE_ID;

const TimeReportsService = {
  configure: function (Notion) {
    this.Notion = Notion;
  },
  getReports: async function () {
    try {
      return await Notion.client.databases.query({
        database_id: timeReportsDB,
      });
    } catch (e) {
      console.error(e);
    }
  },
  createReport: async function (bodyParams) {
    try {
      return await this.Notion.client.pages.create(bodyParams);
    } catch (e) {
      console.error(e);
    }
  },
  createReportWithNativeSchema: async function (
    date,
    personId,
    hours,
    projectId,
    noteText
  ) {
    const timeReport = new TimeReport(
      new Date(date),
      personId,
      hours,
      projectId,
      noteText
    );

    const bodyParams = {
      parent: {
        type: "database_id",
        database_id: timeReportsDB,
      },
      properties: timeReport,
    };

    return await this.createReport(bodyParams);
  },
};

module.exports = TimeReportsService;
