const jwt = require("../servicios/jwt");
const moment = require("moment");
const User = require("../models/user");

// Function to check if the token is expired

function willExpiredToken(token) {
  const { exp } = jwt.decodedToken(token);
  const currentDate = moment().unix();

  if (currentDate > exp) {
    return true;
  } else {
    return false;
  }
}

function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;
  const isTokenExpired = willExpiredToken(refreshToken);
  if (isTokenExpired) {
    res.status(400).send({ message: "El refreshToken ha expirado" });
  } else {
    const { id } = jwt.decodedToken(refreshToken);
    User.findOne({ _id: id }, (err, userStored) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor" });
      } else {
        if (!userStored) {
          res.status(404).send({ message: "Usuario no encontrado" });
        } else {
          res.status(200).send({
            accessToken: jwt.createAccessToken(userStored),
            refreshToken: refreshToken,
          });
        }
      }
    });
  }
}

module.exports = {
  refreshAccessToken,
};
