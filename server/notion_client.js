const { Client, LogLevel } = require("@notionhq/client");

const Notion = {
  token: null,
  client: null,
  integration: {
    id: null,
    type: null,
    name: null,
  },
  configure: async function (integrationType, token) {
    if (token != null) {
      const client = new Client({
        auth: token,
        logLevel: LogLevel.DEBUG,
      });
      try {
        const response = await client.users.me();
        this.token = token;
        this.client = client;
        this.integration.id = response.id;
        this.integration.type = integrationType;
        this.integration.name = response.name;
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  },
};

module.exports = { Notion };
