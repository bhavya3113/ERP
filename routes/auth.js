const express =require('express');
const router = express.Router();

const loginController = require('../controllers/login');

router.get("/login",loginController.login);

module.exports = router;