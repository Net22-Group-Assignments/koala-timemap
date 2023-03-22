const PageService = {
  configure: function (Notion) {
    console.log(`pageservice client ${Notion.token}`);
    this.Notion = Notion;
  },
  RetrievePage: async function (pageId) {
    try {
      const response = await this.Notion.client.pages.retrieve({
        page_id: pageId,
      });
      return response;
    } catch (e) {
      console.error(e);
    }
  },
  UpdatePage: async function (pageId, bodyParams) {
    try {
      return await this.Notion.client.pages.update({
        page_id: pageId,
        ...bodyParams,
      });
    } catch (e) {
      console.error(e);
    }
  },
};

module.exports = PageService;
