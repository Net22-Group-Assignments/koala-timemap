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
    return await Notion.client.pages.create(bodyParams);
  },
  getProjectStatusValues: async function () {
    const Notion = await this.clientPool.obtainInternalClient();
    const response = await Notion.client.databases.retrieve({
      database_id: process.env.PROJECT_DATABASE_ID,
    });
    return response.properties.Status.select.options;
  },
};

module.exports = ProjectsService;
