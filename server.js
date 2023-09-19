require("dotenv").config();
const methodOverride = require("method-override");
const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const APP_PORT = process.env.APP_PORT || 3000;
const app = express();

app.use((req, res, next) => {
  // Configurar los encabezados CORS adecuados
  res.setHeader("Access-Control-Allow-Origin", "https://do-and-check-front-mvp.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  next();
});

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

routes(app);

app.listen(APP_PORT, () => {
  console.log(`\n[Express] Servidor corriendo en el puerto ${APP_PORT}.`);
  console.log(`[Express] Ingresar a http://localhost:${APP_PORT}.\n`);
});

// Esto se ejecuta cuando se "apaga" la app.
process.on("SIGINT", function () {
  const { mongoose } = require("./db");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection is disconnected due to application termination.\n");
    process.exit(0);
  });
});
