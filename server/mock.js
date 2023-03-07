const axios = require("axios");
const dotenv = require("dotenv");

// dotenv.config();
//
// const apiURL = process.env.NOTION_API_URL;
// const apiVersion = process.env.NOTION_API_VERSION;

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

// Returns user object associated with current access_token
// const getMe = async (accessToken) => {
//   try {
//     const response = await axios.get(`${apiURL}/users/me`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Notion-Version": apiVersion,
//       },
//     });
//     return response.data.bot.owner;
//   } catch (error) {
//     console.error(error.response.status);
//   }
// };
//
// // Returns user object associated with userId
// const getUser = async (accessToken, userId) => {
//   try {
//     const response = await axios.get(`${apiURL}/users/${userId}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Notion-Version": apiVersion,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(error.response.status);
//   }
// };
//
// const getUsers = async (accessToken) => {
//   try {
//     const response = await axios.get(`${apiURL}/users/`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Notion-Version": apiVersion,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(error.response.status);
//   }
// };
//
// exports.getMe = getMe;
// exports.getUser = getUser;
// exports.getUsers = getUsers;

exports.MockClient = MockClient;
