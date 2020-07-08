const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;
const portDb = 27017;
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

mongoose.set("useFindAndModify", false);

mongoose.connect(
  `mongodb://${IP_SERVER}:${PORT_DB}/danieltendero`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("La conexion a la BBDD es correcta");

      app.listen(port, () => {
        console.log("#######################");
        console.log("#######################");
        console.log("###### API REST ######");
        console.log("#######################");
        console.log("#######################");
        console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
      });
    }
  }
);
