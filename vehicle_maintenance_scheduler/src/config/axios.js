const axios = require("axios");
require("dotenv").config();

module.exports = axios.create({
  baseURL: "http://4.224.186.213/evaluation-service",
  headers: {
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
  }
});