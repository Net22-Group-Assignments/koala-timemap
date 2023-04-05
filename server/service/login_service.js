const PeopleService = require("./people_service");
const db = require("../db.js");
const axios = require("axios");
const { token } = require("morgan");
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
    const notionOAuthRedirectUrl =
      "https://api.notion.com/v1/oauth/authorize?client_id=c572edd7-44b3-40e6-af1f-0a0f92c2a7d1&response_type=code&owner=user";
    const response = Object.create(signInResponse);
    const tokenInfo = await db.getToken(botId);
    if (!tokenInfo) {
      console.log("Not registered yet");
      response.registerStatus = registerStatus.NOT_REGISTERED;
      response.redirectUrl = notionOAuthRedirectUrl;
      return response;
    }
    console.log("Token info from database");
    console.log(tokenInfo);
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
      console.log("User info from Notion API");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      response.registerStatus = registerStatus.REGISTERED_INVALID;
      response.redirectUrl = notionOAuthRedirectUrl;
      return response;
    }

    // Everything accepted so far now so if this is a public integration,
    // lets see if there is a People page in the Notion People Database
    // that is associated with the user id this bot id associates to
    const authUser = Object.create(authenticatedUser);
    response.authState = authUser;

    if (tokenInfo.integration_type === "public") {
      console.log(tokenInfo);
      const person = await PeopleService.getPeopleByNotionId(
        tokenInfo.user_id,
        "native",
        tokenInfo.bot_id
      );

      if (person == null) {
        console.log("No person found for this user id");
        response.registerStatus = registerStatus.REGISTERED_NO_USER;
      } else {
        console.log("Person found for this user id");
        authUser.person = person;
        response.registerStatus = registerStatus.REGISTERED_USER;
      }

      authUser.integration = {
        id: tokenInfo.bot_id,
        type: tokenInfo.integration_type,
      };

      response.token = tokenInfo.bot_id;
      response.expiresIn = 60 * 60 * 24 * 365;
      response.redirectUrl = "/";
      console.log(response);
      return response;
    } else {
      response.authState = {
        integration: {
          id: process.env.NOTION_API_KEY_ID,
          type: "internal",
        },
        person: {
          id: process.env.NOTION_API_KEY_ID,
          name: "Ishmael",
          role: "Super",
          notion_id: "",
          notion_name: "Snake Plissken",
          notion_email: "",
          avatar_url: null,
        },
      };
      response.registerStatus = registerStatus.REGISTERED_USER;
      response.token = process.env.NOTION_API_KEY_ID;
      response.expiresIn = 60 * 60 * 24 * 365;
      response.redirectUrl = "/";
      return response;
    }
  },

  // Call this function to register a public integration
  registerToken: async (code) => {
    const options = {
      method: "POST",
      url: "https://api.notion.com/v1/oauth/token",
      auth: {
        username: process.env.NOTION_OAUTH_CLIENT_ID,
        password: process.env.NOTION_OAUTH_CLIENT_SECRET,
      },
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        grant_type: "authorization_code",
        code: code,
      },
    };

    const response = await axios.request(options);

    const tokenInfo = {
      bot_id: response.data.bot_id,
      token: response.data.access_token,
      user_id: response.data.owner.user.id,
      integration_type: "public",
      email: response.data.owner.user.person.email,
    };

    await db.deleteToken(tokenInfo.bot_id);

    await db.insertToken(
      tokenInfo.bot_id,
      tokenInfo.token,
      tokenInfo.integration_type,
      tokenInfo.user_id,
      tokenInfo.email
    );

    return tokenInfo;
  },
  deleteAllPublicTokens: async () => {
    await db.deleteAllPublicTokens();
  },
  // Returns all the tokens in the database
  getAllTokens: async () => {
    const rows = await db.getAllTokens();
    return rows;
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
  redirectUrl: "",
  registerStatus: null,
};

const registerStatus = {
  NOT_REGISTERED: "NOT_REGISTERED",
  REGISTERED_INVALID: "REGISTERED_INVALID",
  REGISTERED_NO_USER: "REGISTERED_NO_USER",
  REGISTERED_USER: "REGISTERED_USER",
};

module.exports = LoginService;
