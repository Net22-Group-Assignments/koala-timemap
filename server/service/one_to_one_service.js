const PageService = {
  configure: function (ClientPool) {
    this.clientPool = ClientPool;
  },
  retrievePage: async function (pageId, botId) {
    const Notion = await this.clientPool.obtainClient(botId);
    return await Notion.client.pages.retrieve({
      page_id: pageId,
    });
  },
  updatePage: async function (pageId, bodyParams, botId) {
    const Notion = await this.clientPool.obtainClient(botId);
    return await Notion.client.pages.update({
      page_id: pageId,
      ...bodyParams,
    });
  },
  getProperty: async function (pageId, propertyId, botId) {
    const Notion = await this.clientPool.obtainClient(botId);
    return await Notion.client.pages.properties.retrieve({
      page_id: pageId,
      property_id: propertyId,
    });
  },
};

module.exports = PageService;
