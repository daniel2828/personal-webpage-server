const express = require("express");
const NavigationController = require("../controllers/navigation");
const md_auth = require("../middlewares/authenticated");
const api = express.Router();

// Routes

api.post("/add-navigation", [md_auth.ensureAuth], NavigationController.addNavigation);
api.get("/get-navigations", NavigationController.getNavigations);
api.put("/update-navigation/:id", [md_auth.ensureAuth], NavigationController.updateNavigation);
api.put("/activate-navigation/:id", [md_auth.ensureAuth], NavigationController.activateNavigation);
api.delete("/delete-navigation/:id", [md_auth.ensureAuth], NavigationController.deleteNavigation);
module.exports = api;