const Course = require("../models/courses");

function addCourse(req, res) { 
    const body = req.body;
    const course = new Course(body);
    course.order = 1000;
    course.save((err, courseStored) => { 
        if (err) {
            res.status(400).send({ code: 400, message: "El curso que estas creando ya existe." });
        } else { 
            if (!courseStored) {
                res.status(400).send({ code: 400, message: "No se ha podido crear el curso." });
            } else { 
                res.status(200).send({code: 200, message: "Curso creado correctamente."})
            }
        }

    })
}
function getCourses(req, res) { 
    Course.find()
        .sort({ order: "asc" })
        .exec((err, coursesStored) => { 
            if (err) {
                res.status(500).send({ code: 500, message: "Error del servidor" });
            } else { 
                if (!coursesStored) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado ningún curso" });
                } else { 
                    res.status(200).send({ code: 200, courses: coursesStored });
                }
            }
        })
}
function deleteCourse(req, res) { 
    const id = req.params.id;
    Course.findByIdAndDelete(id, (err, courseDeleted) => { 
        if (err) {
            res.status(500).send({ code: 500 , message : "Error del servidor"});
        } else { 
            if (!courseDeleted) { 
                res.status(404).send({code: 404, message: "No se ha encontrado ningún curso con este id"})
            } else {
                res.status(200).send({
                    code: 200,
                    message: "Curso borrado correctamente"
                })
            }
        }
    })
}
function updateCourse(req, res) { 
    const id = req.params.id;
    const course = req.body;
    Course.findByIdAndUpdate(id, course, (err, courseUpdated) => { 
        if (err) {
            res.status(500).send({ code: 500 , message : "Error del servidor"});
        } else { 
            if (!courseUpdated) { 
                res.status(404).send({code: 404, message: "No se ha encontrado ningún curso con este id"})
            } else {
                res.status(200).send({
                    code: 200,
                    message: "Curso actualizado correctamente"
                })
            }
        }
    })
}
module.exports = {
    addCourse,
    getCourses,
    deleteCourse,
    updateCourse
}