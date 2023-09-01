const express = require("express");
const router = express.Router();
const workerController = require("../controllers/workerController");

router.get("/", workerController.index);
router.get("/:id", workerController.show);

module.exports = router;
