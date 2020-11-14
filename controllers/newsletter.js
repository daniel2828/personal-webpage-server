const Newsletter = require("../models/newsletter");

function suscribeEmail(req, res) { 
   if (req?.params?.email) {
        const newsletter = new Newsletter();
        newsletter.email = req.params.email.toLowerCase();
        newsletter.save((err, newItem) => {
            if (err) {
                if (err.code === 11000)
                    res.status(500).send({  code: 404,message: "Email ya existe en la BBDD" })
                else
                    res.status(500).send({ code: 500, message: "Error del servidor" })
            } else if (!newItem) {
                res.status(404).send({ code: 400, message: "Error al crear un nuevo email" })
            } else {
                res.status(200).send({code:200, message: "Email añadido correctamente" })
            }
        })
    } else { 
        res.status(404).send({ message: "El email es obligatorio" });
    }
}

module.exports = {
    suscribeEmail
};