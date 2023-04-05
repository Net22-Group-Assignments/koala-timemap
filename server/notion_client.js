const { Client, LogLevel, APIErrorCode } = require("@notionhq/client");
const db = require("./db.js");

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
    obtainInternalClient: () => {
      return client;
    },
  };
};

const PublicClientPool = () => {
  const clients = {};
  const internalClient = {
    id: process.env.NOTION_API_KEY_ID,
    type: "internal",
    client: new Client({
      auth: process.env.NOTION_API_KEY,
      logLevel: LogLevel.DEBUG,
    }),
  };

  return {
    obtainClient: async (botId) => {
      console.log("Obtaining client for botId: " + botId);
      if (botId === process.env.NOTION_API_KEY_ID) {
        return internalClient;
      }

      if (clients[botId]) {
        console.log("Client found in array");
        return clients[botId];
      }
      const tokenInfo = await db.getToken(botId);
      if (!tokenInfo) {
        const error = new Error("Token not found");
        error.statusCode = 401;
        throw error;
      }
      const client = {
        id: botId,
        type: tokenInfo.type,
        client: new Client({
          auth: tokenInfo.token,
          logLevel: LogLevel.DEBUG,
        }),
      };
      try {
        await client.users.me();
      } catch (error) {
        if (error.code === APIErrorCode.Unauthorized) {
          const error = new Error("Registered Token in database is invalid");
          error.statusCode = 401;
          throw error;
        }
      }
      clients[botId] = client;
      return client;
    },
    obtainInternalClient: async () => {
      return internalClient;
    },
  };
};

module.exports = { ClientPoolFactory };
