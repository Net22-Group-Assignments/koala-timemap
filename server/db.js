const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./db/koala-timemap.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the koala-timemap database.");
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Close the database connection.");
});
