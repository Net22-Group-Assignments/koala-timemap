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
        console.log("Client found in array");
        return clients[botId];
      }
      let tokenInfo;
      try {
        tokenInfo = await db.getToken(botId);
      } catch (error) {
        console.error("no token found");
        throw "UNREGISTERED_TOKEN";
      }

      const client = {
        id: botId,
        type: tokenInfo.type,
        client: new Client({ auth: tokenInfo.token, logLevel: LogLevel.DEBUG }),
      };
      clients[botId] = client;
      return client;
    },
  };
};

module.exports = { ClientPoolFactory };
