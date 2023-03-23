const ProjectsService = {
  configure: function (ClientPool) {
    this.clientPool = ClientPool;
  },
  getProjects: async function (botId) {
    const Notion = this.clientPool.obtainClient(botId);
    try {
      return await Notion.client.databases.query({
        database_id: process.env.PROJECT_DATABASE_ID,
      });
    } catch (e) {
      console.error(e);
    }
  },
  createProject: async function (bodyParams, botId) {
    const Notion = this.clientPool.obtainClient(botId);
    try {
      return await Notion.client.pages.create(bodyParams);
    } catch (e) {
      console.error(e);
    }
  },
};

module.exports = ProjectsService;
