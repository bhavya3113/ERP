const express = require("express");
const router = express.Router();

const faculty = require("../models/faculty");
const facultyController = require("../controllers/faculty");
const isAuth = require("../middleware/isAuth");


router.post("/attendance",isAuth,facultyController.addAttendance);
router.post("/results",isAuth,facultyController.addresults);
router.get("/viewclass/:batch",isAuth,facultyController.viewClass);
router.get("/viewscores/:batch/:sub",isAuth,facultyController.viewScores);
router.post("/makeannouncement/:id",facultyController.makeAnnouncements);
router.delete("/deleteannouncement/:annid/:facid",facultyController.deleteAnnouncements);
router.get("/viewann/:id",facultyController.viewyourann);
module.exports=router;

