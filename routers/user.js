const express = require("express");
const UserController = require("../controllers/user");
const api = express.Router();

api.post("/sing-up", UserController.singUp);
module.exports = api;
