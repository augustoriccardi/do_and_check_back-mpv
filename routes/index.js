const { expressjwt: checkJwt } = require("express-jwt");
const publicRoutes = require("./publicRoutes");
const privateRoutes = require("./privateRoutes");

module.exports = (app) => {
  app.use("/", publicRoutes);
  app.use(checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }));
  app.use("/", privateRoutes);
};
