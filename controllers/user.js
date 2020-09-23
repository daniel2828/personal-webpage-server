const fs = require("fs");
const path = require("path");
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

function getUsers(req, res) {
  User.find().then((users) => {
    if (!users) {
      res.status(404).send({ message: "No se ha encontrado ningún usuario." });
    } else {
      res.status(200).send({ users });
    }
  });
}
function getUsersActive(req, res) {
  const query = req.query;
  User.find({ active: query.active }).then((users) => {
    if (!users) {
      res.status(404).send({ message: "No se ha encontrado ningún usuario." });
    } else {
      res.status(200).send({ users });
    }
  });
}
function uploadAvatar(req, res) {
  const params = req.params;

  User.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userData) {
        res.status(404).send({ message: "No se ha encontrado ningún usuario" });
      } else {
        let user = userData;
        if (req.files) {
          let filePath = req.files.avatar.path;

          let fileSplit = filePath.split("\\");

          let fileName = fileSplit[2];

          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];

          if (fileExt !== "png" && fileExt !== "jpg") {
            res.status(400).send({
              message:
                "La extensión de la imagen no es válida. (Extensiones permitidas: .png y .jpg)",
            });
          } else {
            user.avatar = fileName;
            User.findByIdAndUpdate(
              { _id: params.id },
              user,
              (err, userResult) => {
                if (err) {
                  res.status(500).send({ message: "Error del servidor." });
                } else {
                  if (!userResult) {
                    res
                      .status(404)
                      .send({ message: "No se ha encontrado ningún usuario." });
                  } else {
                    res.status(200).send({ avatarName: fileName });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

function getAvatar(req, res) {
  console.log(req);
  const avatarName = req.params.avatarName;

  const filePath = "./uploads/avatars/" + avatarName;
  console.log(filePath);

  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.status(404).send({ message: "El avatar que buscas no existe" });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}

function updateUser(req, res) {
  const userData = req.body;
  const params = req.params;
  User.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userUpdate) {
        res
          .status(404)
          .send({ message: "No se ha encontrado nungún usuario." });
      } else {
        res.status(200).send({ message: "Usuario actualizado correctamente." });
      }
    }
  });
}
module.exports = {
  singUp,
  singIn,
  getUsers,
  getUsersActive,
  uploadAvatar,
  getAvatar,
  updateUser,
};
