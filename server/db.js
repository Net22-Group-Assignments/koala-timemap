const sqlite3 = require("sqlite3");
const dotenv = require("dotenv");

dotenv.config();

const config = async () => {
  const db = new sqlite3.Database("./db/koala-timemap.db", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the koala-timemap database.");
  });

  // check if the tokens table exists and that it has the correct columns and contains at least one row
  db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='tokens'",
    (err, row) => {
      if (err) {
        console.error(err.message);
      }
      if (row) {
        console.log("Table tokens exists");
        db.get(
          "SELECT bot_id, token, integration_type FROM tokens WHERE integration_type = 'internal'",
          (err, row) => {
            if (err) {
              console.error(err.message);
            }
            if (row) {
              console.log("Internal token exists");
            } else {
              console.log("Internal token does not exist");
              insertDefaultToken();
            }
          }
        );
      } else {
        console.log("Table tokens does not exist");
        createTokenTable();
        insertDefaultToken();
      }
    }
  );

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });

  // Create a table with a primary key column bot_id of type text called bot_id,
  // and a column called token of type text called token.
  // add a third column called integration_type of type text called integration_type
  const createTokenTable = () => {
    db.run(
      "CREATE TABLE IF NOT EXISTS tokens (bot_id text PRIMARY KEY, token text, integration_type text)",
      (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log("Created table tokens");
      }
    );
  };

  // Insert a row into the tokens table
  const insertDefaultToken = () => {
    db.run(
      "INSERT INTO tokens (bot_id, token, integration_type VALUES (?, ?, ?)",
      [process.env.NOTION_API_KEY_ID, process.env.NOTION_API_KEY, "internal"],
      (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log("Inserted internal key into the tokens table");
      }
    );
  };
};

module.exports = { config };
