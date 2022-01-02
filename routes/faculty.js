const express = require("express");
const router = express.Router();

const faculty = require("../models/faculty");
const facultyController = require("../controllers/faculty");
const isAuth = require("../middleware/isAuth");


router.post("/attendance",isAuth,facultyController.addAttendance);
router.post("/results",isAuth,facultyController.addresults);
router.get("/viewclass/:batch",facultyController.viewClass);
router.get("/viewscores/:batch/:sub",facultyController.viewScores);

module.exports=router;

