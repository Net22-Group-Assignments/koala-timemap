const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const apiURL = process.env.NOTION_API_URL;
const apiVersion = process.env.NOTION_API_VERSION;

// Returns user object associated with current access_token
const getMe = async (accessToken) => {
  try {
    const response = await axios.get(`${apiURL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Notion-Version": apiVersion,
      },
    });
    return response.data.bot.owner.user;
  } catch (error) {
    console.error(error.response.status);
  }
};

// Returns user object associated with userId
const getUser = async (accessToken, userId) => {
  try {
    const response = await axios.get(`${apiURL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Notion-Version": apiVersion,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.status);
  }
};

const getUsers = async (accessToken) => {
  try {
    const response = await axios.get(`${apiURL}/users/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Notion-Version": apiVersion,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.status);
  }
};

exports.getMe = getMe;
exports.getUser = getUser;
exports.getUsers = getUsers;
