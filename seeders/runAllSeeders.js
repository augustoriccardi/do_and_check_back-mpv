require("dotenv").config();

async function runAllSeeders() {
  await require("./adminSeeder")();
  await require("./taskSeeder")();
  await require("./workerSeeder")();
  await require("./taskHrReportSeeder")();
  await require("./taskProgressReportSeeder")();

  console.log("[Database] ¡Los datos de prueba fueron insertados!");
  process.exit();
}

module.exports = runAllSeeders;
