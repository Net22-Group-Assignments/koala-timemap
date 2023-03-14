const { Client } = require("@notionhq/client");

const Notion = {
  token: null,
  client: null,
  integrationType: null,
  configure: function (type, token) {
    if (token != null) {
      const client = new Client({
        auth: token,
      });
      this.token = token;
      this.client = client;
      this.type = type;
    }
  },
};

module.exports = { Notion };
