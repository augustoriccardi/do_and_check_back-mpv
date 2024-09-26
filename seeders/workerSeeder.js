const { faker } = require("@faker-js/faker");
const Worker = require("../models/Worker");

faker.locale = "es";

module.exports = async () => {
  const workers = [];

  for (let i = 0; i < 10; i++) {
    const name = faker.person.firstName();
    const lastname = faker.person.lastName();
    const categoryOptions = ["peón practico", "medio oficial", "oficial"];
    const randomNumber = Math.floor(Math.random() * categoryOptions.length);

    const worker = new Worker({
      firstname: name,
      lastname: lastname,
      avatar: faker.image.avatar(),
      category: categoryOptions[randomNumber],
    });

    workers.push(worker);
    console.log(workers);
  }

  await Worker.insertMany(workers);

  console.log("[Database] Se corrió el seeder de workers");
};
