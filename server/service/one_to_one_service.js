const PageService = {
  configure: function (ClientPool) {
    this.clientPool = ClientPool;
  },
  RetrievePage: async function (pageId, botId) {
    const Notion = await this.clientPool.obtainClient(botId);
    return await Notion.client.pages.retrieve({
      page_id: pageId,
    });
  },
  UpdatePage: async function (pageId, bodyParams, botId) {
    const Notion = await this.clientPool.obtainClient(botId);
    return await Notion.client.pages.update({
      page_id: pageId,
      ...bodyParams,
    });
  },
};

module.exports = PageService;
