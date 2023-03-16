const { Notion } = require("../notion_client");
const PeopleService = require("./people_service");
const LoginService = {
  configure: (Notion) => {
    this.Notion = Notion;
  },
  getAuthenticatedUser: async (id) => {
    const authUser = Object.create(authenticatedUser);
    authUser.integration = Notion.integration;
    authUser.person = await PeopleService.getPeopleById(id, "native");
    return authUser;
  },
  createSignInResponse: async (id) => {
    const response = Object.create(signInResponse);
    response.token = Notion.integration.id;
    response.expiresIn = 5;
    response.authState = await LoginService.getAuthenticatedUser(id);
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
