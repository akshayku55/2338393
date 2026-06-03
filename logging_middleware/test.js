require("dotenv").config();

console.log(process.env.ACCESS_TOKEN.substring(0, 30));

const Log = require("./logger");

(async () => {
  const result = await Log(
    "backend",
    "info",
    "service",
    "Testing fresh token"
  );

  console.log(result);
})();