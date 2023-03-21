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
      const newClient = new Client({
        auth: token,
        logLevel: LogLevel.DEBUG,
      });
      try {
        const response = await newClient.users.me();
        this.token = token;
        this.client = newClient;
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

const ClientPool = () => {
  const clients = {};
  return {
    obtainClient: (botId) => {
      if (clients[botId]) {
        return clients[botId];
      }
      console.error(`No client registered for user ${botId}`);
    },
  };
};

module.exports = { Notion, ClientPool };
