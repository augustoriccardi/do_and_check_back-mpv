const TaskQtyReport = require("../models/TaskQtyReport");

// Display a listing of the resource.
async function index(req, res) {
  try {
    const TaskQtyReports = await TaskQtyReport.find().sort({ date: -1 }).populate("task");
    return res.json(TaskQtyReports);
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
    const taskQtyReportData = req.body;

    // Crea un nuevo informe de cantidad de tareas utilizando el modelo TaskQtyReport
    const newTaskQtyReport = new TaskQtyReport(taskQtyReportData);
    await newTaskQtyReport.save();

    // Envía una respuesta de éxito si todo salió bien
    return res.json({ success: true, message: "New Task Quantity Report saved." });
  } catch (error) {
    // Maneja el error y envía una respuesta de error
    return res.status(501).json({ success: false, error: "Error al procesar la solicitud." });
  }
}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function update(req, res) {
  try {
    const taskQtyReportToUpdate = req.body;
    console.log(taskQtyReportToUpdate);
    await TaskQtyReport.findByIdAndUpdate(req.params.id, taskQtyReportToUpdate);

    // Envía una respuesta de éxito si todo salió bien
    return res.json({ success: true, message: "New Task Quantity Report saved." });
  } catch (error) {
    // Maneja el error y envía una respuesta de error
    return res.status(500).json({ success: false, error: "Error al procesar la solicitud." });
  }
}

// Remove the specified resource from storage.
async function destroy(req, res) {
  try {
    await TaskQtyReport.findByIdAndDelete(req.params.id);
    return res.json("Task Quantity Report has been deleted");
  } catch (error) {
    return res.json("Error deleting the requested Task Quantity Report");
  }
}

module.exports = {
  index,
  show,
  create,
  store,
  edit,
  update,
  destroy,
};
