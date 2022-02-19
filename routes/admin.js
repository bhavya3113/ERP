const express = require("express");
const router = express.Router();

const faculty = require("../models/faculty");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");


router.post("/addfaculty",isAuth,adminController.addFaculty);

router.post("/addbatch",isAuth,adminController.addnewbatch);
router.delete("/deletestudent/:id",isAuth,adminController.removeStudents);
router.post("/addstudents",isAuth,adminController.addStudents);
// router.get("/addbranches",adminController.addBranches);
router.get("/viewbranches",adminController.viewBranches);
// router.get("/addsubjects",adminController.addSubjects);
router.get("/viewsubjects",adminController.viewSubjects);
// router.get("/addexams",adminController.addExams);
router.get("/viewexams",adminController.viewExams); 
router.post("/updatemodels",adminController.addBranchOrSubjectOrExam);

router.post("/timetable",isAuth,adminController.timetable);
router.post("/savetimetable",adminController.saveTimetable);

router.post("/holidays",adminController.holidays);
router.get("/showholidays",adminController.showHoliday);
router.get("/getbatch/:year",adminController.batchlist);
router.post("/makeadmin",isAuth,adminController.makeAdmin);
router.get("/viewbatch",adminController.viewBatch);
router.get("/viewfaculty",adminController.viewfaculty);

const multer = require('multer');
const storage = multer.diskStorage({
    destination:(req ,file ,cb)=>{
        cb(null ,'image')
    },
    filename: (req,file ,cb)=>{
        cb(null ,file.originalname);
    }
});
let upload = multer({storage:storage});
router.get("/showprofile/:id",adminController.showProfile);
router.put("/editprofile/:id",upload.single('image'),adminController.editProfile);
module.exports=router;

