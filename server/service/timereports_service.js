const dotenv = require("dotenv");
const TimeReport = require("../timemap_objects");
const { Notion } = require("../notion_client");
const PeopleService = require("./people_service");
const ProjectService = require("./projects_service");
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
  getCollatedReports: async function () {
    const reports = await this.getReports();
    const people = await PeopleService.getPeople(null, "notion");
    const projects = await ProjectService.getProjects();
    const collatedReports = reports.results.map((report) => {
      const relatedPerson = report.properties.Person;
      const relatedPersonId = relatedPerson.relation[0].id;
      const relatedPersonData = people.results.find(
        (person) => person.id === relatedPersonId
      );
      relatedPerson.relation_properties = {
        Name: relatedPersonData.properties.Name,
      };
      const relatedProject = report.properties.Project;
      const relatedProjectId = relatedProject.relation[0].id;
      const relatedProjectData = projects.results.find(
        (project) => project.id === relatedProjectId
      );
      relatedProject.relation_properties = {
        Projectname: relatedProjectData.properties.Projectname,
      };
      return report;
    });
    reports.results = collatedReports;
    return reports;
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
