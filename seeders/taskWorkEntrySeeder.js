const Worker = require("../models/Worker");
const Team = require("../models/Team");
const Task = require("../models/Task");
const CostLabourFactor = require("../models/CostLabourFactor");
const DailyWorkReport = require("../models/DailyWorkReport");
const TaskWorkEntry = require("../models/TaskWorkEntry");
const { faker } = require("@faker-js/faker");

faker.locale = "es";

module.exports = async () => {
  try {
    const workers = await Worker.find();

    for (const worker of workers) {
      const teams = await Team.find({ _id: { $in: worker.team } });

      for (const team of teams) {
        const currentDate = team.dateEstablished.toISOString().split("T")[0];
        const hasEntries = team.tasks.some((taskEntry) => taskEntry.productiveHours.length > 0);

        if (hasEntries) {
          let dailyWorkReport = await DailyWorkReport.findOne({
            date: currentDate,
            supervisor: team.leader,
          });

          if (!dailyWorkReport) {
            dailyWorkReport = new DailyWorkReport({
              date: currentDate,
              supervisor: team.leader,
              entries: [],
            });
            await dailyWorkReport.save();
          }

          for (const taskEntry of team.tasks) {
            const shouldHaveProgress = taskEntry.productiveHours.length > 0;

            if (shouldHaveProgress) {
              let taskWorkEntry = new TaskWorkEntry({
                date: currentDate,
                worker: worker._id,
                task: taskEntry.task,
                productiveHrs: [],
                nonProductiveHrs: [],
              });

              const productivityHourTypes = ["normal", "extra", "night"];
              const nonProductiveHourTypes = ["rain"];

              for (const hourType of productivityHourTypes) {
                let hours = 0;

                if (hourType === "normal") {
                  hours = 8;
                } else if (hourType === "extra") {
                  hours = 1;
                } else if (hourType === "night") {
                  hours = Math.floor(Math.random() * 2);
                }

                taskWorkEntry.productiveHrs.push({
                  type: hourType,
                  hours: hours,
                });
              }

              for (const hourType of nonProductiveHourTypes) {
                taskWorkEntry.nonProductiveHrs.push({
                  type: hourType,
                  hours: Math.floor(Math.random() * 5) + 1,
                });
              }

              await taskWorkEntry.save();

              dailyWorkReport.entries.push(taskWorkEntry._id);

              dailyWorkReport = await DailyWorkReport.findOneAndUpdate(
                { date: currentDate },
                { $push: { entries: taskWorkEntry._id } },
                { upsert: true, new: true },
              );

              const taskToUpdate = await Task.findById(taskEntry.task);

              const hoursProgressEntry = {
                date: taskWorkEntry.date,
                productiveHrs: taskWorkEntry.productiveHrs,
              };

              const quantityProgressEntry = {
                date: taskWorkEntry.date,
                completedQty: Math.floor(Math.random() * 10) + 1,
              };

              taskToUpdate.quantityProgress.push(quantityProgressEntry);
              taskToUpdate.hoursProgress.push(hoursProgressEntry);

              const productiveHoursTotal = taskWorkEntry.productiveHrs.reduce(
                (total, hour) => total + hour.hours,
                0,
              );

              const costLabourFactor = await CostLabourFactor.findOne().sort({ createdAt: -1 });
              const coefficient = costLabourFactor ? costLabourFactor.costLabourFactor : 1;

              taskToUpdate.totalWorkerHours += productiveHoursTotal;
              taskToUpdate.totalMeasuredQuantity += quantityProgressEntry.completedQty;
              taskToUpdate.acumPerfRatio =
                taskToUpdate.totalWorkerHours / taskToUpdate.totalMeasuredQuantity;
              taskToUpdate.costOverrunEst =
                (taskToUpdate.acumPerfRatio - taskToUpdate.budgetPerfRatio) *
                taskToUpdate.totalLabourCost *
                coefficient;

              if (taskToUpdate.quantityProgress.length > 0 || productiveHoursTotal > 0) {
                taskToUpdate.taskStatus = "pending";
              } else {
                taskToUpdate.taskStatus = "uninitiated";
              }

              await taskToUpdate.save();

              console.log(
                `Task work entry and daily report created for ${worker.firstname} ${worker.lastname} in team ${team.title} for task ${taskToUpdate.title}`,
              );
            }
          }

          await dailyWorkReport.save();
        }
      }
    }

    console.log("[Database] Task work entries and daily reports seeder completed.");
  } catch (error) {
    console.error("Error:", error);
  }
};
