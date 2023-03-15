const dotenv = require("dotenv");
dotenv.config();
const peopleDB = process.env.PEOPLE_DATABASE_ID;

const PeopleService = {
  configure: function (Notion) {
    this.Notion = Notion;
  },
  getPeople: async function (filter, simplify = false) {
    let query = { database_id: peopleDB };
    if (filter != null) {
      query = { ...query, filter };
    }
    try {
      const response = await this.Notion.client.databases.query(query);
      if (simplify) {
        let people = [];
        response.results.map((person) => {
          people = [...people, filterPeople(person)];
        });
        return people;
      }
      return response;
    } catch (e) {
      console.error(e);
    }
  },
  getPeopleById: async function (peopleId, simplify = false) {
    try {
      const person = await this.Notion.client.pages.retrieve({
        page_id: peopleId,
      });
      if (simplify) {
        return filterPeople(person);
      }
      return person;
    } catch (e) {
      console.error(e);
    }
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
  };
};

module.exports = PeopleService;
