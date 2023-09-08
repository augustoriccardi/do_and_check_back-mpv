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

      const perfFluctuationCoef = Math.random() * (1.7 - 0.5) + 0.5;

      // Calcular el avance de tarea basado en budgetPerfRatio y taskHrReport.hours
      const progressQty =
        Math.floor(taskHrReport.hours / task.budgetPerfRatio / perfFluctuationCoef) + 1;

      // // Guardar la tarea actualizada en la base de datos
      // await task.save();

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
