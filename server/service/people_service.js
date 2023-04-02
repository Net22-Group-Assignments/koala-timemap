const dotenv = require("dotenv");
dotenv.config();
const peopleDB = process.env.PEOPLE_DATABASE_ID;

const PeopleService = {
  configure: function (ClientPool) {
    this.clientPool = ClientPool;
  },
  getPeople: async function (filter, schema = "notion", botId) {
    let query = { database_id: peopleDB };
    if (filter != null) {
      query = { ...query, filter };
    }
    const Notion = await this.clientPool.obtainClient(botId);
    const response = await Notion.client.databases.query(query);
    if (schema === "native") {
      let people = [];
      response.results.map((person) => {
        people = [...people, filterPeople(person)];
      });
      return people;
    }
    return response;
  },
  getPeopleById: async function (peopleId, schema = "notion", botId) {
    const Notion = this.clientPool.obtainClient(botId);
    const person = await Notion.client.pages.retrieve({
      page_id: peopleId,
    });
    if (schema === "native") {
      return filterPeople(person);
    }
    return person;
  },
  getPeopleByNotionId: async function (notionUserId, schema = "notion", botId) {
    const filter = {
      property: "Notion User",
      people: {
        contains: notionUserId,
      },
    };
    const personArray = await this.getPeople(filter, schema, botId);
    return personArray[0];
  },
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
    notion_email: notionUser?.person?.email,
    avatar_url: notionUser?.avatar_url,
  };
};

module.exports = PeopleService;
