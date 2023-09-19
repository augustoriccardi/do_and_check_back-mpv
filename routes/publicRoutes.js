const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/adm-login", adminController.token);

module.exports = router;
