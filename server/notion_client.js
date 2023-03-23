const { Client, LogLevel } = require("@notionhq/client");

// const Notion = {
//   token: null,
//   client: null,
//   integration: {
//     id: null,
//     type: null,
//     name: null,
//   },
//   configure: async function (integrationType, token) {
//     if (token != null) {
//       const newClient = new Client({
//         auth: token,
//         logLevel: LogLevel.DEBUG,
//       });
//       try {
//         const response = await newClient.users.me();
//         this.token = token;
//         this.client = newClient;
//         this.integration.id = response.id;
//         this.integration.type = integrationType;
//         this.integration.name = response.name;
//         return true;
//       } catch (e) {
//         console.error(e);
//         return false;
//       }
//     }
//   },
// };

// Factory returns a ClientPool object that can be used to obtain a Notion client
// If a database is passed in, the ClientPool will be configured to use the
// database to store and retrieve tokens for public integrations
const ClientPoolFactory = (db = null) => {
  if (!db) {
    return InternalClientPool(process.env.NOTION_API_KEY);
  } else {
    return PublicClientPool();
  }
};
const InternalClientPool = (token) => {
  const client = {
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
