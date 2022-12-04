const { Router } = require('express');
const {register, login} = require('../controllers/auth');


const  router = Router();

//resgistrar usuarios

router.post('/register',register)

//login del usuario
router.post('/login',login)

module.exports = router;