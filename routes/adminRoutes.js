const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const workerController = require("../controllers/workerController");
const taskController = require("../controllers/taskController");

router.get("/", adminController.index);
router.post("/", adminController.store);
router.patch("/:id", adminController.update);
router.delete("/:id", adminController.destroy);

router.delete("/worker/:id", workerController.destroy);
router.post("/worker", workerController.store);

router.post("/task", taskController.store);
router.patch("/task/:id", taskController.update);
router.delete("/task/:id", taskController.destroy);

module.exports = router;