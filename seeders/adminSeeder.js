const Admin = require("../models/Admin");

module.exports = async () => {
  const admin = await new Admin({
    firstname: "name",
    lastname: "lastname",
    username: "admin",
    password: "admin",
    category_code: "100",
  });

  await admin.save();

  console.log("[Database] Se corrió el seeder de admin");
};
