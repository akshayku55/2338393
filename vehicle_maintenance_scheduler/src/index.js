// vehicle_maintenance_scheduler/src/index.js

const axios = require("axios");
require("dotenv").config();

(async () => {
  try {
    const depots = await axios.get(
      "http://4.224.186.213/evaluation-service/depots",
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    console.log(JSON.stringify(depots.data, null, 2));
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
})();