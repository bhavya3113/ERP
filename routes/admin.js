const express = require("express");
const router = express.Router();

const faculty = require("../models/faculty");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");


router.post("/addfaculty",isAuth,adminController.addFaculty);
router.post("/addstudents",isAuth,adminController.addStudents);
module.exports=router;

