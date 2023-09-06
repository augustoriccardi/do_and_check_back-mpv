const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Worker = require("../models/Worker");
const Task = require("../models/Task");
const TaskHrReport = require("../models/TaskHrReport");
const TaskProgressReport = require("../models/TaskProgressReport");
const runAllSeeders = require("../seeders/runAllSeeders");

async function showHome(req, res) {
  res.render("pages/home");
}

async function showContact(req, res) {
  res.render("pages/contact");
}

async function showAboutUs(req, res) {
  hg;
  res.render("pages/aboutUs");
}

async function reset(req, res) {
  const collections = [
    Admin.collection,
    Worker.collection,
    Task.collection,
    TaskHrReport.collection,
    TaskProgressReport.collection,
  ];

  try {
    // Verificar si las colecciones existen
    const collectionExistsPromises = collections.map((collection) =>
      mongoose.connection.db.listCollections({ name: collection.name }).hasNext(),
    );
    const collectionExistsResults = await Promise.all(collectionExistsPromises);

    // Eliminar solo las colecciones existentes
    const collectionsToDrop = collections.filter(
      (collection, index) => collectionExistsResults[index],
    );

    // Eliminar las colecciones
    const dropPromises = collectionsToDrop.map((collection) => collection.drop());
    await Promise.all(dropPromises);

    // Volver a ejecutar los seeders
    await runAllSeeders();

    // Enviar una respuesta exitosa al frontend
    res.status(200).json({ message: "Seeders completados con éxito" });
  } catch (error) {
    console.error("Error al reiniciar la base de datos:", error);
    return res.status(500).json("Error al reiniciar la base de datos");
  }
}

async function show404(req, res) {
  res.status(404).render("pages/404");
}

module.exports = {
  showHome,
  showContact,
  showAboutUs,
  reset,
};
