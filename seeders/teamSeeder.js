const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

const Worker = require("../models/Worker");
const Team = require("../models/Team");
const Task = require("../models/Task");

faker.locale = "es";

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function getRandomWorkerSupervisor(workerSupervisorIds) {
  const randomIndex = getRandomIndex(workerSupervisorIds);
  return workerSupervisorIds[randomIndex];
}

module.exports = async () => {
  const numTeamsToCreate = 5; // Cantidad de equipos

  try {
    const workerSupervisorIds = await Worker.find({ category: "supervisor" }).distinct("_id");
    const tasks = await Task.find();

    for (let i = 0; i < numTeamsToCreate; i++) {
      const randomWorkerSupervisor = getRandomWorkerSupervisor(workerSupervisorIds);

      const team = new Team({
        title: `Equipo ${i + 1}`,
        dateEstablished: faker.date.past(),
        leader: randomWorkerSupervisor,
        members: [], // Inicialmente vacío, se agregarán miembros más adelante
        tasks: [],
        nonProductiveHours: [],
      });

      // Ensure each team has a maximum of 3 workers
      const maxMembersPerTeam = 4;
      const numRandomMembers = Math.min(
        Math.floor(Math.random() * (maxMembersPerTeam + 1)),
        maxMembersPerTeam,
      );

      // Add random members to the team
      const activeWorkers = await Worker.find({ status: "activo", category: "operator" });

      const eligibleMembers = activeWorkers.filter(
        (worker) => !randomWorkerSupervisor.equals(worker._id),
      );

      if (eligibleMembers.length > 0) {
        // Agregar miembros al equipo de manera aleatoria
        const selectedMembers = [];
        for (let j = 0; j < numRandomMembers; j++) {
          if (eligibleMembers.length > 0) {
            const randomMember = eligibleMembers.splice(getRandomIndex(eligibleMembers), 1)[0];
            selectedMembers.push(randomMember);
          } else {
            console.log(
              `No hay suficientes trabajadores elegibles disponibles para el Equipo ${team.title}`,
            );
            break; // Detener el ciclo si no hay suficientes trabajadores elegibles
          }
        }

        for (const member of selectedMembers) {
          team.members.push(member._id);
          member.team.push(team._id); // Agregar referencia del equipo al miembro
          await member.save();
        }

        // Add predefined tasks with associated productive hours
        const numTasksPerTeam = Math.floor(Math.random() * 3) + 1; // Número aleatorio entre 1 y 3 tareas por equipo
        const shuffledTasks = tasks.slice(); // Copiar las tareas para evitar modificar el arreglo original
        for (let k = shuffledTasks.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          [shuffledTasks[k], shuffledTasks[j]] = [shuffledTasks[j], shuffledTasks[k]];
        }
        const selectedTasks = shuffledTasks.slice(0, numTasksPerTeam);

        for (const task of selectedTasks) {
          const taskData = {
            task: task._id,
            productiveHours: [],
          };

          const shouldHaveProgress = Math.random() < 0.5; // Probabilidad del 50% de tener avances

          if (shouldHaveProgress) {
            const productiveHourTypes = ["normal", "extra", "night"];

            for (const hourType of productiveHourTypes) {
              taskData.productiveHours.push({
                hours: hourType,
                quantity: Math.floor(Math.random() * 5) + 1,
              });
            }
          }

          team.tasks.push(taskData);
        }

        // Add predefined non-productive hours (only "rain" for now)
        team.nonProductiveHours.push({
          hours: "rain",
          quantity: Math.floor(Math.random() * 5) + 1,
        });

        await team.save();

        console.log(`Equipo ${team.title} creado`);
      } else {
        console.log(
          `No hay suficientes trabajadores elegibles disponibles para crear el Equipo ${team.title}`,
        );
      }
    }

    // Después de crear los equipos, actualiza los workers con las referencias a los equipos a los que pertenecen
    const teams = await Team.find();

    for (const team of teams) {
      const workersInTeam = await Worker.find({ _id: { $in: team.members } });

      for (const worker of workersInTeam) {
        worker.team.push(team._id);
        await worker.save();
      }
    }

    console.log("Updating workers with team references completed.");
  } catch (error) {
    console.error("Error:", error);
  }
};
