const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.get("/", taskController.index);
router.get("/:id", taskController.show);

module.exports = router;
