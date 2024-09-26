require("dotenv").config();

async function runAllSeeders() {
  console.log("[Database] Insertando datos de prueba...");
  await require("./adminSeeder")();
  await require("./taskSeeder")();
  await require("./workerSeeder")();
  await require("./taskHrReportSeeder")();
  await require("./TaskQtyReportSeeder")();

  console.log("[Database] ¡Los datos de prueba fueron insertados!");
}

module.exports = runAllSeeders;

// Llamar a la función runAllSeeders si este archivo se ejecuta directamente
if (require.main === module) {
  runAllSeeders().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
