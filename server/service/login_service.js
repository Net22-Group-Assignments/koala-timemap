const PeopleService = require("./people_service");
const LoginService = {
  configure: (ClientPool) => {
    this.clientPool = ClientPool;
  },
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
