const PageService = require("./one_to_one_service");
const ProjectsService = {
  configure: function (ClientPool) {
    this.clientPool = ClientPool;
  },
  getProjects: async function (botId) {
    const Notion = await this.clientPool.obtainClient(botId);
    return await Notion.client.databases.query({
      database_id: process.env.PROJECT_DATABASE_ID,
      sorts: [{ property: "Timespan", direction: "descending" }],
    });
  },
  createProject: async function (bodyParams, botId) {
    const Notion = await this.clientPool.obtainClient(botId);
    if (!bodyParams.parent) {
      bodyParams.parent = {
        type: "database_id",
        database_id: process.env.PROJECT_DATABASE_ID,
      };
    }
    return await Notion.client.pages.create(bodyParams);
  },
  // Delegates to the general updatePage function
  // from one_to_one_service.js
  updateProject: async function (body, botId) {
    const projectId = body.page_id;
    const bodyParams = body.body_params;
    return await PageService.updatePage(projectId, bodyParams, botId);
  },
  // Collects all the project status values from the database
  getProjectStatusValues: async function () {
    const Notion = await this.clientPool.obtainInternalClient();
    const response = await Notion.client.databases.retrieve({
      database_id: process.env.PROJECT_DATABASE_ID,
    });
    return response.properties.Status.select.options;
  },
};

module.exports = ProjectsService;
