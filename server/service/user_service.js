const UserService = {
  configure: function (ClientPool) {
    this.clientPool = ClientPool;
  },
  getTokenBotUser: async function (botId) {
    const Notion = await this.clientPool.obtainClient(botId);
    const response = await Notion.client.users.me();
    if (Notion.type === "public") return response.bot.owner.user;
    return response;
  },
  getNotionUserById: async function (userId, botId) {
    const Notion = this.clientPool.obtainClient(botId);
    return await Notion.client.users.retrieve({ user_id: userId });
  },
  getNotionUsers: async function (botId) {
    const Notion = this.clientPool.obtainClient(botId);
    return await Notion.client.users.list();
  },
};

module.exports = UserService;
