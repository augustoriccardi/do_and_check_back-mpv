const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");
const adminController = require("../controllers/adminController");

router.get("/", pagesController.showHome);
router.post("/adm-login", adminController.token);

module.exports = router;
