const UserService = {
  configure: function (clientPool) {
    this.clientPool = clientPool;
  },
  getTokenBotUser: async function (botId) {
    try {
      const Notion = this.clientPool.obtainClient(botId);
      const response = Notion.client.users.me();
      if (Notion.integrationType === "public") return response.bot.owner.user;
      return response;
    } catch (e) {
      console.error(e);
    }
  },
  getNotionUserById: async function (userId) {
    try {
      return await this.Notion.client.users.retrieve({ user_id: userId });
    } catch (e) {
      console.error(e);
    }
  },
  getNotionUsers: async function () {
    try {
      return await this.Notion.client.users.list();
    } catch (e) {
      console.error(e);
    }
  },
};

module.exports = UserService;
