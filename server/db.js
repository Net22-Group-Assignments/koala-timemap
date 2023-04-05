const Database = require("better-sqlite3");
const fs = require("fs");

const config = async () => {
  try {
    if (!fs.existsSync("./db")) {
      fs.mkdirSync("./db");
    }
  } catch (err) {
    console.error(err);
  }

  const db = new Database("./db/koala-timemap.db", { verbose: console.log });
  const createTokenTableStmt = db.prepare(
    "CREATE TABLE IF NOT EXISTS tokens (bot_id TEXT PRIMARY KEY, token TEXT, integration_type TEXT, user_id TEXT, email TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP)"
  );
  createTokenTableStmt.run();
  // Create the one-time-password table
  const createOtpTableStmt = db.prepare(
    "CREATE TABLE IF NOT EXISTS otp (bot_id TEXT PRIMARY KEY, otp TEXT, email TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP)"
  );
  createOtpTableStmt.run();

  // If table tokens is empty, insert a row with the default token
  const selectTokenStmt = db.prepare("SELECT * FROM tokens");
  const rows = selectTokenStmt.all();
  if (rows.length === 0) {
    const insertTokenStmt = db.prepare(
      "INSERT INTO tokens (bot_id, token, integration_type, user_id, email) VALUES (?, ?, ?, ?, ?)"
    );
    insertTokenStmt.run(
      process.env.NOTION_API_KEY_ID,
      process.env.NOTION_API_KEY,
      "internal",
      process.env.NOTION_API_KEY_ID,
      "bjorn.agnemo@edu.edugrade.se"
    );
  }

  db.close();
};

const getToken = async (bot_id) => {
  const db = new Database("./db/koala-timemap.db", { verbose: console.log });
  const selectTokenStmt = db.prepare("SELECT * FROM tokens WHERE bot_id = ?");
  const row = selectTokenStmt.get(bot_id);
  db.close();
  return row;
};

const getAllTokens = async () => {
  const db = new Database("./db/koala-timemap.db", { verbose: console.log });
  const selectTokenStmt = db.prepare("SELECT * FROM tokens");
  const rows = selectTokenStmt.all();
  db.close();
  return rows;
};

const insertToken = async (bot_id, token, integration_type, user_id, email) => {
  const db = new Database("./db/koala-timemap.db", { verbose: console.log });
  const insertTokenStmt = db.prepare(
    "INSERT INTO tokens (bot_id, token, integration_type, user_id, email) VALUES (?, ?, ?, ?, ?)"
  );
  insertTokenStmt.run(bot_id, token, integration_type, user_id, email);
  db.close();
};

const deleteToken = async (bot_id) => {
  const db = new Database("./db/koala-timemap.db", { verbose: console.log });
  const deleteTokenStmt = db.prepare("DELETE FROM tokens WHERE bot_id = ?");
  const info = deleteTokenStmt.run(bot_id);
  if (info.changes !== 0) {
    console.log(`Deleted token with bot id ${bot_id}`);
  }
  db.close();
};

const deleteAllPublicTokens = async () => {
  const db = new Database("./db/koala-timemap.db", { verbose: console.log });
  const deleteTokenStmt = db.prepare(
    "DELETE FROM tokens WHERE integration_type = 'public'"
  );
  const info = deleteTokenStmt.run();
  console.log(`Deleted ${info.changes} rows`);
  db.close();
};

// Function to insert a row into the otp table. It should take in a bot_id and an otp
// as parameters and generate a timestamp for the current time;
const insertOtp = async (bot_id, otp, email) => {
  const db = new Database("./db/koala-timemap.db", { verbose: console.log });
  const insertOtpStmt = db.prepare(
    "INSERT INTO otp (bot_id, otp, email) VALUES (?, ?, ?)"
  );
  insertOtpStmt.run(bot_id, otp, email);
  db.close();
};

// Returns an otp object from the otp table with the created_atdate converted to local time
const getOtp = async (bot_id) => {
  const db = new Database("./db/koala-timemap.db", { verbose: console.log });
  const selectOtpStmt = db.prepare(
    "SELECT otp, email, datetime(created_at, 'localtime') as created_at FROM otp WHERE bot_id = ?"
  );
  const row = selectOtpStmt.get(bot_id);
  db.close();
  return row;
};

// Deletes a row from the otp table
const deleteOtp = async (bot_id) => {
  const db = new Database("./db/koala-timemap.db", { verbose: console.log });
  const deleteOtpStmt = db.prepare("DELETE FROM otp WHERE bot_id = ?");
  const info = deleteOtpStmt.run(bot_id);
  db.close();
  if (info.changes !== 0) {
    console.log(`Deleted otp with bot id ${bot_id}`);
  }
};

// Check token table if email exists
const getTokenByEmail = async (email) => {
  const db = new Database("./db/koala-timemap.db", { verbose: console.log });
  const selectEmailStmt = db.prepare("SELECT * FROM tokens WHERE email = ?");
  const row = selectEmailStmt.get(email);
  db.close();
  return row;
};

module.exports = {
  config,
  getToken,
  getAllTokens,
  insertToken,
  deleteToken,
  deleteAllPublicTokens,
  insertOtp,
  getOtp,
  deleteOtp,
  getTokenByEmail,
};
