const Worker = require("../models/Worker");
const Task = require("../models/Task");
const TaskHrReport = require("../models/TaskHrReport");
const TaskQtyReport = require("../models/TaskQtyReport");

const { faker } = require("@faker-js/faker");

faker.locale = "es";

module.exports = async () => {
  try {
    const taskHrReports = await TaskHrReport.find();

    for (const taskHrReport of taskHrReports) {
      const task = await Task.findById(taskHrReport.task);

      // Calcular el valor mínimo y máximo para progressQty
      const minValue = (taskHrReport.hours / task.budgetPerfRatio) * 0.9; // 60% del valor original
      const maxValue = (taskHrReport.hours / task.budgetPerfRatio) * 1.3; // 140% del valor original

      // Calcular un valor aleatorio dentro del rango
      const progressQty = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

      // Crear un nuevo informe de progreso basado en el avance

      const newTaskQtyReport = new TaskQtyReport({
        date: taskHrReport.date,
        task: task._id,
        progressQty: progressQty,
      });

      // Guardar el nuevo informe de progreso en la base de datos
      await newTaskQtyReport.save();

      // Modificar taskStatus si tiene horas o cantidades
      if (progressQty > 0) {
        task.taskStatus = "pending";
        await task.save();
      }
    }

    console.log("[Database] Se corrió el seeder de task quantity reports");
  } catch (error) {
    console.error("Error:", error);
  }
};
