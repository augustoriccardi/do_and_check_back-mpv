const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");
const workerController = require("../controllers/workerController");
const adminController = require("../controllers/adminController");

router.get("/", pagesController.showHome);
router.post("/login", workerController.token);
router.post("/adm-login", adminController.token);
router.patch("/reset", pagesController.reset);

module.exports = router;
