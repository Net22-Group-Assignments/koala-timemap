const { Client, LogLevel } = require("@notionhq/client");
const db = require("./db");

const ClientPoolFactory = (db = null) => {
  if (!db) {
    return InternalClientPool(process.env.NOTION_API_KEY);
  } else {
    return PublicClientPool();
  }
};
const InternalClientPool = (token) => {
  const client = {
    id: process.env.NOTION_API_KEY_ID,
    type: "internal",
    client: new Client({ auth: token, logLevel: LogLevel.DEBUG }),
  };
  return {
    obtainClient: () => {
      return client;
    },
  };
};

const PublicClientPool = () => {
  const clients = {};
  return {
    obtainClient: async (botId) => {
      if (clients[botId]) {
        return clients[botId];
      }
      let tokenInfo = await db.getToken(botId);
      if (!tokenInfo) {
        console.error(`No client registered for user ${botId}`);
      }
      this.registerClient(botId, tokenInfo.integration_type, tokenInfo.token);
    },
    registerClient: (botId, type, token) => {
      const client = {
        id: botId,
        type: type,
        client: new Client({ auth: token, logLevel: LogLevel.DEBUG }),
      };
      clients[botId] = client;
    },
  };
};

module.exports = { ClientPoolFactory };
