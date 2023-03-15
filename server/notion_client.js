const { Client, LogLevel } = require("@notionhq/client");

const Notion = {
  token: null,
  client: null,
  integrationType: null,
  configure: function (type, token) {
    if (token != null) {
      const client = new Client({
        auth: token,
        logLevel: LogLevel.DEBUG,
      });
      this.token = token;
      this.client = client;
      this.type = type;
    }
  },
};

module.exports = { Notion };
