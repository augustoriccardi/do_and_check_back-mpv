const Worker = require("../models/Worker");
const Task = require("../models/Task");
const TaskHrReport = require("../models/TaskHrReport");
const { faker } = require("@faker-js/faker");

faker.locale = "es";

module.exports = async () => {
  try {
    const tasks = await Task.find();
    const workers = await Worker.find();
    const numDailyHoursToCreate = 15;
    let taskHrReports = [];

    // Crear un arreglo de índices aleatorios únicos para las tareas
    const randomTaskIndices = Array.from({ length: numDailyHoursToCreate }, (_, index) => index);
    for (let index = randomTaskIndices.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [randomTaskIndices[index], randomTaskIndices[randomIndex]] = [
        randomTaskIndices[randomIndex],
        randomTaskIndices[index],
      ];
    }

    for (let index = 0; index < numDailyHoursToCreate; index++) {
      const randomTaskIndex = randomTaskIndices[index];
      const task = randomTaskIndex < tasks.length ? tasks[randomTaskIndex] : null;

      const newTaskHrReport = new TaskHrReport({
        date: faker.date.past(),
        worker: workers[Math.floor(Math.random() * workers.length)],
        task: task,
        hours: Math.floor(Math.random() * 8) + 1,
      });
      taskHrReports.push(newTaskHrReport);

      // Obtener el documento actualizado de la base de datos
      const taskToUpdate = await Task.findById(task._id); // Cambiar a _id

      // Calcular productiveHoursTotal (supongo que es el total de horas productivas en el informe)
      const productiveHoursTotal = newTaskHrReport.hours;

      // Actualizar los campos relevantes en el modelo Task
      taskToUpdate.totalWorkerHours += productiveHoursTotal;

      // Guardar el documento actualizado en la base de datos
      await taskToUpdate.save();
    }

    await TaskHrReport.create(taskHrReports);

    console.log("[Database] Se corrió el seeder de task hour reports");
  } catch (error) {
    console.error("Error:", error);
  }
};
