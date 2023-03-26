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
          "SELECT bot_id, token, integration_type, user_id FROM tokens WHERE integration_type = 'internal'",
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
      "CREATE TABLE IF NOT EXISTS tokens (bot_id text PRIMARY KEY, token text, integration_type text, user_id text)",
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
      "INSERT INTO tokens (bot_id, token, integration_type, user_id VALUES (?, ?, ?, ?)",
      [
        process.env.NOTION_API_KEY_ID,
        process.env.NOTION_API_KEY,
        "internal",
        process.env.NOTION_API_KEY_ID,
      ],
      (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log("Inserted internal key into the tokens table");
      }
    );
  };
};

// A function that connects to the database and returns a row from the tokens table depending on the bot_id
const getToken = async (bot_id) => {
  const db = new sqlite3.Database("./db/koala-timemap.db", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the koala-timemap database.");
  });

  return new Promise((resolve, reject) => {
    db.all(
      "SELECT DISTINCT * FROM tokens WHERE bot_id = ?",
      [bot_id],
      (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(row);
      }
    );
  }).finally(() => {
    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  });
};

// Return all rows from the tokens table as a promise
const getAllTokens = async () => {
  const db = new sqlite3.Database("./db/koala-timemap.db", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the koala-timemap database.");
  });

  return new Promise((resolve, reject) => {
    db.all(
      "SELECT bot_id, token, integration_type, user_id FROM tokens",
      (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        if (rows) {
          console.log("Tokens exist");
          resolve(rows);
        } else {
          console.log("Tokens do not exist");
          reject(null);
        }
      }
    );
  }).finally(() => {
    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  });
};

// A function that connects to the database and inserts a row into the tokens table
const insertToken = async (bot_id, token, integration_type, user_id) => {
  const db = new sqlite3.Database("./db/koala-timemap.db", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the koala-timemap database.");
  });

  db.run(
    "INSERT INTO tokens (bot_id, token, integration_type, user_id) VALUES (?, ?, ?, ?)",
    [bot_id, token, integration_type, user_id],
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Inserted token into the tokens table");
    }
  );

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
};

// A function that connects to the database and deletes all token rows except the internal token from the tokens table
const deleteAllPublicTokens = async () => {
  const db = new sqlite3.Database("./db/koala-timemap.db", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the koala-timemap database.");
  });

  db.run(
    "DELETE FROM tokens WHERE integration_type != 'internal'",
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(
        `Deleted ${this.changes} public tokens from the tokens table`
      );
    }
  );

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
};

module.exports = {
  config,
  getToken,
  getAllTokens,
  insertToken,
  deleteAllPublicTokens,
};
