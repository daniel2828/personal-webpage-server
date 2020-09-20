const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");
const User = require("../models/user");

function singUp(req, res) {
  const user = new User();
  const { name, lastName, email, password, repeatPassword } = req.body;
  console.log(lastName);

  user.name = name;
  user.lastname = lastName;
  user.email = email.toLowerCase();
  //Default values
  user.role = "admin";
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Las contraseñas son obligatorias" });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ message: "Las contraseñas no son iguales" });
    } else {
      // encryp password
      bcrypt.hash(password, null, null, function (err, hash) {
        if (err) {
          res
            .status(500)
            .send({ message: "Error al encriptar la contraseña." });
        } else {
          user.password = hash;
          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: "El usuario ya existe" });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "Error al crear usuario." });
              } else {
                res.status(200).send({ user: userStored });
              }
            }
          });
        }
      });
      //res.status(200).send({ message: "Usuario creado" });
    }
    console.log("Continuar");
  }
  console.log("Endpoint de singUp");
}

function singIn(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;
  // Find by email in mongo database
  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else if (!userStored) {
      res.status(404).send({ message: "Email no encontrado." });
    } else {
      // Check password
      bcrypt.compare(password, userStored.password, (err, check) => {
        if (err) {
          res.status(500).send({ message: "Error de servidor." });
        } else if (!check) {
          res.status(404).send({ message: "La contraseña no es correcta." });
        } else if (!userStored.active) {
          res
            .status(200)
            .send({ code: 200, message: "El usuario no está activo." });
        } else {
          res.status(200).send({
            accessToken: jwt.createAccessToken(userStored),
            refreshToken: jwt.createRefreshToken(userStored),
          });
        }
      });
    }
  });
  console.log(params);
}
module.exports = {
  singUp,
  singIn,
};
