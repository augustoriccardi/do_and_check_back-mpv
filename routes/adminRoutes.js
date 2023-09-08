const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const workerController = require("../controllers/workerController");
const taskController = require("../controllers/taskController");
const taskHrReportController = require("../controllers/taskHrReportController");
const TaskQtyReportController = require("../controllers/TaskQtyReportController");
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
router.delete("/task-hr-reports/:id", taskHrReportController.destroy);
router.patch("/task-hr-reports/:id", taskHrReportController.update);

router.get("/task-qty-reports", TaskQtyReportController.index);
router.post("/task-qty-reports", TaskQtyReportController.store);
router.delete("/task-qty-reports/:id", TaskQtyReportController.destroy);
router.patch("/task-qty-reports/:id", TaskQtyReportController.update);

module.exports = router;
