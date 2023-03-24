const { Client, LogLevel, APIErrorCode } = require("@notionhq/client");
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
      const rows = await db.getToken(botId);
      if (rows.length === 0) {
        const error = new Error("Token not found");
        error.statusCode = 401;
        throw error;
      }
      const tokenInfo = rows[0];
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
  };
};

module.exports = { ClientPoolFactory };
