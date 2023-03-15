const UserService = {
  configure: function (Notion) {
    this.Notion = Notion;
  },
  getTokenBotUser: async function () {
    try {
      const response = this.Notion.client.users.me();
      if (this.Notion.integrationType === "public")
        return response.bot.owner.user;
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
