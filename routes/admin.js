const express = require("express");
const router = express.Router();

const faculty = require("../models/faculty");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");


router.post("/addfaculty",isAuth,adminController.addFaculty);
router.post("/addstudents",isAuth,adminController.addStudents);
// router.get("/addbranches",adminController.addBranches);
router.get("/viewbranches",adminController.viewBranches);
// router.get("/addsubjects",adminController.addSubjects);
router.get("/viewsubjects",adminController.viewSubjects);
// router.get("/addexams",adminController.addExams);
router.get("/viewexams",adminController.viewExams); 
router.post("/updatemodels",adminController.addBranchOrSubjectOrExam);

module.exports=router;

