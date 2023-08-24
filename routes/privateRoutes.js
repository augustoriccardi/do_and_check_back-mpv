const express = require("express");
const router = express.Router();
const adminRoutes = require("./adminRoutes");
const workerRoutes = require("./workerRoutes");
const tasksRoutes = require("./tasksRoutes");

router.use("/admin", adminRoutes);
router.use("/workers", workerRoutes);
router.use("/tasks", tasksRoutes);

module.exports = router;
