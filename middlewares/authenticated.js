const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "gR7cH9Svfj8JLe4c186Ghs48hheb3902nh5DsA";

exports.ensureAuth = (req, res, next) => {
  if (!req.heaeders.autorization) {
    return res
      .status(403)
      .send({ message: "La petición no tiene cabecera de autentificación" });
  } else {
    const token = req.heaedrs.autorization.replace(/['"]+/g, "");
  }
  try {
    const payload = jwt.decode(token, SECRET_KEY);
    // TOken expired
    if (payload.exp < moment.unix()) {
      return res.status(404).send({ message: "El token ha expirado" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: "Token inválido" });
  }
  req.user = payload;
  next();
};
