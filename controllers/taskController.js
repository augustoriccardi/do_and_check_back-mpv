const Task = require("../models/Task");
const slugify = require("slugify");
const Admin = require("../models/Admin");

async function index(req, res) {
  try {
    const tasks = await Task.find();
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

async function show(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    return res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

async function store(req, res) {
  const {
    code,
    title,
    description,
    taskGroup,
    taskStatus,
    unit,
    totalBudgetQty,
    totalBudgetHrs,
    totalLabourCost,
  } = req.body;

  if (
    !code ||
    !title ||
    !description ||
    !taskGroup ||
    !taskStatus ||
    !unit ||
    !totalBudgetQty ||
    !totalBudgetHrs ||
    !totalLabourCost
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const taskComplemented = {
    ...req.body,
    totalWorkerHours: 0,
    totalMeasuredQuantity: 0,
    acumPerfRatio: 0,
    costOverrunEst: 0,
    slug: slugify(req.body.title, {
      replacement: "-",
      lower: true,
    }),
    quantityProgress: [],
    hoursProgress: [],
    budgetPerfRatio: totalBudgetHrs / totalBudgetQty,
  };

  try {
    const newTask = new Task(taskComplemented);
    await newTask.save();
    return res.json("[Database] New task saved.");
  } catch (error) {
    return res.status(500).json({ error: "Error saving task." });
  }
}

async function update(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const {
      code,
      title,
      taskGroup,
      description,
      taskStatus,
      unit,
      totalBudgetQty,
      totalBudgetHrs,
      totalLabourCost,
    } = req.body;

    const updatedTask = {
      code,
      title,
      taskGroup,
      description,
      taskStatus,
      unit,
      totalBudgetQty,
      totalBudgetHrs,
      totalLabourCost,
      budgetPerfRatio: totalBudgetHrs / totalBudgetQty,
    };

    await Task.findByIdAndUpdate(req.params.id, updatedTask);

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function destroy(req, res) {
  try {
    await Task.findByIdAndDelete(req.params.id);
    return res.json("Task has been deleted");
  } catch (error) {
    return res.json("Error deleting the requested task");
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
