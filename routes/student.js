const express = require("express");
const router = express.Router();

const Student = require("../models/student");
const studentController = require("../controllers/student");
const isAuth = require("../middleware/isAuth");

router.get("/viewattendance/:student",studentController.viewAttendance);

module.exports=router;

