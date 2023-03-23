const { Client, LogLevel } = require("@notionhq/client");

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
    obtainClient: (botId) => {
      if (clients[botId]) {
        return clients[botId];
      }
      console.error(`No client registered for user ${botId}`);
    },
    registerClient: (botId, client) => {
      clients[botId] = client;
    },
  };
};

module.exports = { ClientPoolFactory };
