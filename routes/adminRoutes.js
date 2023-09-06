const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const workerController = require("../controllers/workerController");
const taskController = require("../controllers/taskController");
const taskHrReportController = require("../controllers/taskHrReportController");
const taskProgressReportController = require("../controllers/taskProgressReportController");
const pagesController = require("../controllers/pagesController");

router.patch("/reset", pagesController.reset);
router.get("/", adminController.index);
router.post("/", adminController.store);
router.patch("/:id", adminController.update);
router.delete("/:id", adminController.destroy);

router.delete("/worker/:id", workerController.destroy);
router.post("/worker", workerController.store);
router.patch("/worker/:id", workerController.update);

router.post("/task", taskController.store);
router.patch("/task/:id", taskController.update);
router.delete("/task/:id", taskController.destroy);

router.get("/task-hr-reports", taskHrReportController.index);
router.post("/task-hr-reports", taskHrReportController.store);

router.get("/task-progress-reports", taskProgressReportController.index);
router.post("/task-progress-reports", taskProgressReportController.store);

module.exports = router;
