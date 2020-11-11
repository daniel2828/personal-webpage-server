const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NavigationSchema = Schema({
    title: String,
    url: String,
    order: Number,
    active: Boolean,
    left: Boolean
})

module.exports = mongoose.model("Navigation", NavigationSchema);