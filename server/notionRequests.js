const { MockClient } = require("./mock");
const storage = require("node-persist");
const { Client } = require("@notionhq/client");
const dotenv = require("dotenv");
const integrationArgIndex = process.argv.indexOf("--integration");

dotenv.config();

const peopleDB = process.env.PEOPLE_DATABASE_ID;

let status = {
  integration_type: null,
  access_token: null,
  valid_token: false,
};

if (integrationArgIndex > -1) {
  status.integration_type = process.argv[integrationArgIndex + 1];
}

let notion = null;

const init = async () => {
  if (status.integration_type === "mock") {
    notion = MockClient;
    status.access_token = "00000000-0000-0000-0000-000000000000";
    status.validToken = true;
    return;
  }

  if (status.integration_type === "internal" && !process.env.NOTION_API_KEY) {
    console.log("No internal access token in .env file");
    process.exit(1);
  }
  await storage.init();
  status.access_token =
    status.integration_type === "public"
      ? await storage.getItem("access_token")
      : process.env.NOTION_API_KEY;
  console.log(`Access token: ${status.access_token}`);
  if (status.access_token != null) {
    notion = new Client({
      auth: status.access_token,
    });
    try {
      const response = await notion.users.me();
      status.valid_token = true;
      console.log("USER:");
      if (status.integrationType === "public") {
        console.log(response.bot.owner.user);
      } else {
        console.log(response);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.error(
          `Bearer Token ${status.access_token} in storage not valid`
        );
        //await storage.removeItem("access_token");
      }
    }
  }
};

init();

// Retrieves the Notion user object associated with current token
const getTokenBotUser = async () => {
  try {
    const response = await notion.users.me();
    if (status.integrationType === "public") return response.bot.owner.user;
    return response;
  } catch (e) {
    console.error(e);
  }
};

const getNotionUserById = async (userId) => {
  try {
    return await notion.users.retrieve({ user_id: userId });
  } catch (e) {
    console.error(e);
  }
};

const getNotionUsers = async () => {
  try {
    return await notion.users.list();
  } catch (e) {
    console.error(e);
  }
};

const getPeople = async (filter) => {
  let query = { database_id: peopleDB };
  if (filter != null) {
    query = { ...query, filter };
  }
  try {
    let people = [];
    const response = await notion.databases.query(query);
    response.results.map((person) => {
      people = [...people, filterPeople(person)];
    });
    return people;
  } catch (e) {
    console.error(e);
  }
};

const getPeopleById = async (peopleId) => {
  try {
    const person = await notion.pages.retrieve({ page_id: peopleId });
    return filterPeople(person);
  } catch (e) {
    console.error(e);
  }
};

const filterPeople = (person) => {
  const { id, properties } = person;
  const notionUser = properties["Notion User"]?.people[0];
  return {
    id,
    name: properties["Name"].title[0].plain_text,
    role: properties["Role"].select.name,
    notion_id: notionUser?.id,
    notion_name: notionUser?.name,
  };
};

module.exports = {
  status,
  getTokenBotUser,
  getNotionUserById,
  getNotionUsers,
  getPeople,
  getPeopleById,
};
