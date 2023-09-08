const Worker = require("../models/Worker");
const Task = require("../models/Task");
const TaskHrReport = require("../models/TaskHrReport");
const { faker } = require("@faker-js/faker");

faker.locale = "es";

module.exports = async () => {
  try {
    const allTasks = await Task.find();
    const numTaskHrReportToCreate = 5;
    let taskHrReports = [];

    const randomTasks = faker.helpers.arrayElements(allTasks, numTaskHrReportToCreate);

    const workers = await Worker.find();

    for (const task of randomTasks) {
      for (let reportIndex = 0; reportIndex < 5; reportIndex++) {
        const startDate = new Date(`2023-01-01`);
        const endDate = new Date();

        const newTaskHrReport = new TaskHrReport({
          date: faker.date.between(startDate, endDate),
          worker: workers[Math.floor(Math.random() * workers.length)],
          task: task,
          hours: Math.floor(Math.random() * 8) + 1,
        });

        taskHrReports.push(newTaskHrReport);
      }
    }

    await TaskHrReport.create(taskHrReports);

    console.log("[Database] Se corrió el seeder de task hour reports");
  } catch (error) {
    console.error("Error:", error);
  }
};
