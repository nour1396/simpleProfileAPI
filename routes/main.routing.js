const router = require('express').Router()
const isLoggedIn = require('../middleware/auth');
const userController = require('../controllers/user.controller');
const validationController = require('../controllers/validation.controller');
const postController = require('../controllers/post.controller');

//===== get  form =====
router.get('/', userController.getLogin);

//===== get registration form =====
router.get('/registration', userController.getRegistration);

//===== save registration form =====
router.post('/registration', validationController.registrationValidation, userController.postRegistration);

//===== get login form =====
router.get('/login', userController.getLogin);

//===== submit login =====
router.post('/login', userController.handleLogin);

//===== get get all posts  =====
router.get('/home', isLoggedIn, userController.home);

//===== get my posts  =====
router.get('/profile', isLoggedIn, postController.profile);

//===== add new post =====
router.post('/newPost', postController.postHandler);

//===== get edit post form =====
router.get('/editPost/:id', postController.getEditPost);

//===== update post =====
router.post('/editPost/:id', postController.handleEditPost);

//===== delete post =====
router.get('/deletePost/:id', postController.handleDeletePost);

//===== get accountSetting form =====
router.get('/accountSetting', isLoggedIn, userController.accountSetting);

router.post('/editPass', validationController.editPassValidation, userController.editPass);

//===== logout =====
router.get('/logout', userController.logout);

//===== get any path not mentioned direct to not found pages =====
router.get('*', userController.notFound);

module.exports = router