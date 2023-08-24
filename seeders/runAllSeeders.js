require("dotenv").config();

async function runAllSeeders() {
  await require("./adminSeeder")();
  await require("./costLabourFactorSeeder")();
  await require("./taskSeeder")();
  await require("./workerSeeder")();
  await require("./teamSeeder")();
  await require("./taskWorkEntrySeeder")();

  console.log("[Database] ¡Los datos de prueba fueron insertados!");
  process.exit();
}

module.exports = runAllSeeders;
