const Task = require("../models/Task");
const path = require("path");
const ExcelJS = require("exceljs");
const slugify = require("slugify");

const excelToJson = async () => {
  const filePath = path.join(__dirname, "Table_Budget.xlsx");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1); // Asume que la hoja que necesitas es la primera

  const jsonData = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Saltar la fila de encabezado
    const rowData = {};
    row.eachCell((cell, colNumber) => {
      const header = worksheet.getRow(1).getCell(colNumber).value;
      rowData[header] = cell.value;
    });
    jsonData.push(rowData);
  });

  return jsonData;
};

const runTaskSeeder = async () => {
  const tasksData = await excelToJson();

  const tasks = tasksData.map((taskData) => {
    const slug = slugify(taskData.title, {
      replacement: "-",
      lower: true,
    });

    return {
      ...taskData, // Utilizar el spread operator para copiar las propiedades originales
      budgetPerfRatio: taskData.totalBudgetHrs / taskData.totalBudgetQty,
      slug: slug,
    };
  });

  await Task.insertMany(tasks);
  console.log("[Database] Se corrió el seeder de tasks");
};

module.exports = runTaskSeeder;
