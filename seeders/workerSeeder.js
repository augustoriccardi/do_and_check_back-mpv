const { faker } = require("@faker-js/faker");
const Team = require("../models/Team");
const Worker = require("../models/Worker");
const bcrypt = require("bcryptjs");

faker.locale = "es";

module.exports = async () => {
  const teams = await Team.find();

  const workers = [];

  const supervisor1 = new Worker({
    firstname: "John",
    lastname: "Lennon",
    avatar: faker.internet.avatar(),
    password: "lennon",
    email: "jlennon@gmail.com",
    phone: "099111111",
    category: "supervisor",
  });

  const supervisor2 = new Worker({
    firstname: "Dvid",
    lastname: "Bowie",
    avatar: faker.internet.avatar(),
    password: "bowie",
    email: "dbowie@gmail.com",
    phone: "099222222",
    category: "supervisor",
  });

  supervisor1.password = await bcrypt.hash(supervisor1.password, 8);
  supervisor2.password = await bcrypt.hash(supervisor2.password, 8);
  workers.push(supervisor1, supervisor2);

  for (let i = 0; i < 10; i++) {
    const name = faker.name.firstName();
    const lastname = faker.name.lastName();
    const email = faker.internet.email(`${name}`, `${lastname}`);
    const status_options = ["activo", "inactivo"];
    const randomNumber = Math.floor(Math.random() * status_options.length);

    const numTeams = Math.floor(Math.random() * 3) + 1; // Random number of teams (1 to 3)
    const randomTeams = teams.slice(0, numTeams);

    const worker = new Worker({
      firstname: name,
      lastname: lastname,
      avatar: faker.internet.avatar(),
      password: await bcrypt.hash("1234", 8),
      email: email,
      phone: faker.phone.number("099######"),
      category: "operator",
      documentNumber: Math.floor(Math.random() * 90000000) + 10000000,
      status: status_options[randomNumber],
      team: randomTeams.map((team) => team._id),
    });

    workers.push(worker);
  }

  await Worker.insertMany(workers);

  console.log("[Database] Se corrió el seeder de workers");
};
