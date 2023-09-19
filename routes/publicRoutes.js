const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const pagesController = require("../controllers/pagesController");

router.get("/", pagesController.showHome);
router.post("/adm-login", adminController.token);

module.exports = router;
