const Admin = require("../models/Admin");

module.exports = async () => {
  const admin = await new Admin({
    firstname: "Name",
    lastname: "Lastname",
    password: "admin",
    email: "admin@email.com",
    phone: "099123123",
  });

  await admin.save();

  console.log("[Database] Se corrió el seeder de admin");
};
