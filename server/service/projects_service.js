const ProjectsService = {
  configure: function (Notion) {
    this.Notion = Notion;
  },
  getProjects: async function () {
    try {
      return await this.Notion.client.databases.query({
        database_id: process.env.PROJECT_DATABASE_ID,
      });
    } catch (e) {
      console.error(e);
    }
  },
  createProject: async function (bodyParams) {
    try {
      return await this.Notion.client.pages.create(bodyParams);
    } catch (e) {
      console.error(e);
    }
  },
};

module.exports = ProjectsService;
