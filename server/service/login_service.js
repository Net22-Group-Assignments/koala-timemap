const PeopleService = require("./people_service");
const db = require("../db");
const axios = require("axios");
const LoginService = {
  configure: (ClientPool) => {
    this.clientPool = ClientPool;
  },
  // Following 2 function are only for dev testing purpose with only internal keys.
  getAuthenticatedUser: async (personId) => {
    const Notion = this.clientPool.obtainClient(process.env.NOTION_API_KEY_ID);
    const authUser = Object.create(authenticatedUser);
    authUser.integration = { id: Notion.id, type: Notion.type };
    authUser.person = await PeopleService.getPeopleById(personId, "native");
    return authUser;
  },
  createSignInResponse: async (personId) => {
    const response = Object.create(signInResponse);
    response.token = process.env.NOTION_API_KEY;
    response.expiresIn = 5;
    response.authState = await LoginService.getAuthenticatedUser(personId);
    return response;
  },
  // This function is the one that should be used when running with public integration
  signIn: async (botId) => {
    const rows = await db.getToken(botId);
    if (rows.length === 0) {
      return null;
    }
    const tokenInfo = rows[0];

    // use tokenInfo.token with axios to connect to Notion API https://api.notion.com/v1/users/me
    const options = {
      method: "GET",
      url: "https://api.notion.com/v1/users/me",
      headers: {
        accept: "application/json",
        "Notion-Version": process.env.NOTION_API_VERSION,
        Authorization: `Bearer ${tokenInfo.token}`,
      },
    };
    try {
      const response = await axios.request(options);
    } catch (error) {
      console.error(error);
      return null;
    }

    // Everything accepted so far now so if this is a public integration,
    // lets see if there is a People page in the Notion People Database
    // that is associated with the user id this bot id associates to
    const authUser = Object.create(authenticatedUser);
    if (tokenInfo.integration_type === "public") {
      console.log(tokenInfo);
      const person = await PeopleService.getPeopleByNotionId(
        tokenInfo.user_id,
        "native",
        tokenInfo.bot_id
      );
      if (person == null) {
        const error = new Error("No People page found for this user");
        error.statusCode = 401;
        throw error;
      }
      authUser.person = person;
    }
    authUser.integration = {
      id: tokenInfo.bot_id,
      type: tokenInfo.integration_type,
    };
    const response = Object.create(signInResponse);
    response.token = tokenInfo.bot_id;
    response.expiresIn = 60;
    response.authState = authUser;
    return response;
  },
};

const authenticatedUser = {
  integration: {},
  person: {},
};

const signInResponse = {
  token: "",
  expiresIn: 0,
  authState: {},
};

module.exports = LoginService;
