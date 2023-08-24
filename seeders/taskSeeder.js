const Task = require("../models/Task");
const path = require("path");
const xlsx = require("xlsx");
const slugify = require("slugify");

const excelToJson = () => {
  const filePath = path.join(__dirname, "Table_Budget.xlsx");
  const excel = xlsx.readFile(filePath);
  const nombrehoja = excel.SheetNames;
  return xlsx.utils.sheet_to_json(excel.Sheets[nombrehoja[0]]);
};

const tasksData = excelToJson();

const tasks = tasksData.map((taskData) => {
  const slug = slugify(taskData.title, {
    replacement: "-",
    lower: true,
  });

  return {
    ...taskData, // Utilizar el spread operator para copiar las propiedades originales
    acumPerfRatio: 0,
    costOverrunEst: 0,
    totalMeasuredQuantity: 0,
    totalWorkerHours: 0,
    slug: slug,
  };
});

module.exports = async () => {
  await Task.insertMany(tasks);

  console.log("[Database] Se corrió el seeder de tasks");
};
