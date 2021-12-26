const express = require("express");
const router = express.Router();

const faculty = require("../models/faculty");
const facultyController = require("../controllers/faculty");
const isAuth = require("../middleware/isAuth");


router.post("/attendance",isAuth,facultyController.addAttendance);

module.exports=router;

