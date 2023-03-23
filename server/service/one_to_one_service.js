const PageService = {
  configure: function (ClientPool) {
    this.clientPool = ClientPool;
  },
  RetrievePage: async function (pageId, botId) {
    try {
      const Notion = this.clientPool.obtainClient(botId);
      return Notion.client.pages.retrieve({
        page_id: pageId,
      });
    } catch (e) {
      console.error(e);
    }
  },
  UpdatePage: async function (pageId, bodyParams, botId) {
    const Notion = this.clientPool.obtainClient(botId);
    try {
      return await Notion.client.pages.update({
        page_id: pageId,
        ...bodyParams,
      });
    } catch (e) {
      console.error(e);
    }
  },
};

module.exports = PageService;
