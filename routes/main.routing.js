const router = require('express').Router()
    /* const indexModel = require('../models/index.model')
    const controller = require('../controllers/index.controller')
    const validation = require('../controllers/validation.controller')
    const noteController = require('../controllers/note.controller') */
const isLoggedIn = require('../middleware/auth');
const userController = require('../controllers/user.controller');
const validationController = require('../controllers/validation.controller');
/* indexRouter.get('/', controller.signup)
indexRouter.get('/signup', controller.signup)
indexRouter.post('/handleSignUp', validation.signupValidation, controller.handleSignUp)
indexRouter.get('/signin', controller.signin)
indexRouter.post('/handleSignin', controller.handleSignin)
indexRouter.get('/home', isLoggedIn, controller.home)
indexRouter.post('/addNote', noteController.noteHandler)
indexRouter.get('/logout', controller.logout)
indexRouter.get('*', controller.notfound) */
router.get('/registration', userController.getRegistration);

router.post('/registration', validationController.registrationValidation, userController.postRegistration);

router.get('/login', userController.getLogin);

router.post('/login', userController.handleLogin);

router.get('/profile', userController.profile);

module.exports = router