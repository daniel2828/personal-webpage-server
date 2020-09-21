const express = require("express");
const UserController = require("../controllers/user");

const md_auth = require("../middlewares/authenticated");
const api = express.Router();

api.post("/sign-up", UserController.singUp);
api.post("/sign-in", UserController.singIn);
api.get("/users", [md_auth.ensureAuth], UserController.getUsers);
module.exports = api;
