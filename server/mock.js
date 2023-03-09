const axios = require("axios");
const dotenv = require("dotenv");

const MockClient = {
  users: {
    me() {
      return {
        object: "user",
        id: "d40e767c-d7af-4b18-a86d-55c61f1e39a4",
        type: "person",
        person: {
          email: "avo@example.org",
        },
        name: "Avocado Lovelace",
        avatar_url:
          "https://secure.notion-static.com/e6a352a8-8381-44d0-a1dc-9ed80e62b53d.jpg",
      };
    },
  },
};

exports.MockClient = MockClient;
