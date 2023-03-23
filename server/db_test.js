const db = require("./db");

(async () => {
  // const tokens = await db.getAllTokens();
  // console.log(tokens);
  const token = await db.getToken("16eb2615-67cb-49af-8adb-8f9036cc9144");
  console.log(token);
})();
