const Worker = require("../models/Worker");
const Task = require("../models/Task");
const TaskHrReport = require("../models/TaskHrReport");
const TaskProgressReport = require("../models/TaskProgressReport");

const { faker } = require("@faker-js/faker");

faker.locale = "es";

module.exports = async () => {
  try {
    const taskHrReports = await TaskHrReport.find();

    for (const taskHrReport of taskHrReports) {
      const task = await Task.findById(taskHrReport.task);

      // Generar un coeficiente de fluctuación entre 1 y 1.5
      const perfFluctuationCoef = Math.random() * 0.5 + 1;

      // Calcular el avance de tarea basado en budgetPerfRatio y taskHrReport.hours
      const progressQty = taskHrReport.hours / (task.budgetPerfRatio * perfFluctuationCoef);
      task.totalMeasuredQuantity += progressQty;

      // Calcular y actualizar acumPerfRatio y costOverrunEst
      task.acumPerfRatio = task.totalWorkerHours / task.totalMeasuredQuantity;
      task.costOverrunEst = (task.acumPerfRatio - task.budgetPerfRatio) * task.totalLabourCost;

      // Guardar la tarea actualizada en la base de datos
      await task.save();

      // Crear un nuevo informe de progreso basado en el avance
      const newTaskProgressReport = new TaskProgressReport({
        date: faker.date.past(),
        task: task._id,
        progressQty: progressQty,
      });

      // Guardar el nuevo informe de progreso en la base de datos
      await newTaskProgressReport.save();

      // Modificar taskStatus si tiene horas o cantidades
      if (task.totalWorkerHours > 0 || task.totalMeasuredQuantity > 0) {
        task.taskStatus = "pending";
        await task.save();
      }
    }

    console.log("[Database] Se corrió el seeder de task progress reports");
  } catch (error) {
    console.error("Error:", error);
  }
};
