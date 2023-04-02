const dotenv = require("dotenv");
const TimeReport = require("../timemap_objects");
const PeopleService = require("./people_service");
const ProjectService = require("./projects_service");
const PageService = require("./one_to_one_service");
dotenv.config();
const timeReportsDB = process.env.TIMEREPORTS_DATABASE_ID;

const TimeReportsService = {
  configure: function (ClientPool) {
    this.clientPool = ClientPool;
  },
  getReports: async function (botId) {
    const Notion = await this.clientPool.obtainClient(botId);
    return await Notion.client.databases.query({
      database_id: timeReportsDB,
      sorts: [{ property: "Date", direction: "descending" }],
      filter: {
        and: [
          {
            property: "Person",
            relation: {
              is_not_empty: true,
            },
          },
          {
            property: "Project",
            relation: {
              is_not_empty: true,
            },
          },
        ],
      },
    });
  },
  // Get all time reports from Notion and add the related
  // person and project data to the report object.
  // This is a workaround for the fact that Notion does not
  // support relational queries.
  getCollatedReports: async function (botId) {
    const reports = await this.getReports(botId);
    const people = await PeopleService.getPeople(null, "notion", botId);
    const projects = await ProjectService.getProjects(botId);
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
  // Post a new time report to Notion. If the bodyParams object
  // does not contain a parent property, it will be added.
  createReport: async function (bodyParams, botId) {
    const Notion = await this.clientPool.obtainClient(botId);
    if (!bodyParams.parent) {
      bodyParams.parent = {
        type: "database_id",
        database_id: process.env.TIMEREPORTS_DATABASE_ID,
      };
    }
    const response = await Notion.client.pages.create(bodyParams);
    const personId = response.properties.Person.relation[0].id;
    const projectId = response.properties.Project.relation[0].id;
    const Name = await PageService.getProperty(personId, "title", botId);
    const ProjectName = await PageService.getProperty(
      projectId,
      "title",
      botId
    );
    response.properties.Person["relation_properties"] = {};
    response.properties.Person["relation_properties"]["Name"] = Name.results[0];
    response.properties.Project["relation_properties"] = {};
    response.properties.Project["relation_properties"]["Projectname"] =
      ProjectName.results[0];
    return response;
  },
  // Posts a new time report to Notion, using the timemap_objects.js schema
  createReportWithNativeSchema: async function (
    date,
    personId,
    hours,
    projectId,
    noteText,
    botId
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

    return await this.createReport(bodyParams, botId);
  },
};

module.exports = TimeReportsService;
