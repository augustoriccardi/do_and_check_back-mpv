const TaskHrReport = require("../models/TaskHrReport");

// Display a listing of the resource.
async function index(req, res) {
  try {
    const taskHrReports = await TaskHrReport.find();
    return res.json(taskHrReports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Display the specified resource.
async function show(req, res) {}

// Show the form for creating a new resource
async function create(req, res) {}

// Store a newly created resource in storage.
async function store(req, res) {
  try {
    const workersHrsReport = req.body;
    const taskHrReport = [];

    for (const workerHrsReport of workersHrsReport) {
      taskHrReport.push({
        date: workerHrsReport.date,
        worker: workerHrsReport.workerId,
        task: workerHrsReport.taskId,
        hours: workerHrsReport.hours,
      });
    }

    await TaskHrReport.insertMany(taskHrReport);

    // Envía una respuesta de éxito si todo salió bien
    return res.json({ success: true, message: "New Task Hour Report saved." });
  } catch (error) {
    // Maneja el error y envía una respuesta de error
    return res.status(500).json({ success: false, error: "Error al procesar la solicitud." });
  }
}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function update(req, res) {}

// Remove the specified resource from storage.
async function destroy(req, res) {}

// Otros handlers...
// ...

module.exports = {
  index,
  show,
  create,
  store,
  edit,
  update,
  destroy,
};
