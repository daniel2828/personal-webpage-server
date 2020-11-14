const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const CourseSchema = Scheme({
    idCourse: {
        type: Number,
        unique: true,
        require :true
    },
    link: String,
    coupon: String,
    price: Number,
    order: Number
})

module.exports = mongoose.model("Course", CourseSchema);