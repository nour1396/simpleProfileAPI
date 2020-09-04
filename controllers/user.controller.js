const User = require('../models/users').User;
const Post = require('../models/posts').Post;
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.getRegistration = async(req, res) => {
    res.render('registration', {
        pageTitle: "registration",
        isLoggedIn: false,
        MessageError: [],
        oldData: { firstName: '', lastName: '', userName: '', email: '', password: '', confirmPassword: '' }
    })
};

exports.postRegistration = async(req, res) => {
    let err = validationResult(req);
    let {
        firstName,
        lastName,
        userName,
        email,
        password,
        confirmPassword
    } = req.body,
        userImg = req.file.path;
    if (err.isEmpty()) {
        const user = await User.findOne({ email });
        if (user) {
            res.render("registration", {
                pageTitle: "registration",
                MessageError: [{ param: "exists" }],
                isLoggedIn: false,
                oldData: { firstName, lastName, userName, email, password, confirmPassword },
            });
        } else {
            bcrypt.hash(password, 8, function(err, hashPassword) {
                let user = new User({
                    firstName,
                    lastName,
                    userName,
                    email,
                    password: hashPassword,
                    userImg
                });
                user.save();
                res.redirect('login')
            });
        }
    } else {
        res.render("registration", {
            pageTitle: "registration",
            isLoggedIn: false,
            MessageError: err.array(),
            oldData: { firstName, lastName, userName, email, password, confirmPassword },
        });
    }



};
exports.getLogin = async(req, res) => {
    res.render("index", {
        pageTitle: "Login",
        isLoggedIn: false,
        MessageError: [],
        oldData: { email: '', password: '' },
    });
};

exports.handleLogin = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.isLoggedIn = true;
            req.session.userID = user._id;
            req.session.userName = user.userName;
            req.session.firstName = user.firstName;
            req.session.lastName = user.lastName;
            req.session.userImg = user.userImg;
            res.redirect('/home')
        } else {
            res.render("index", {
                pageTitle: "login",
                isLoggedIn: false,
                MessageError: [{ param: 'incorrect' }],
                oldData: { email, password },
            });
        }
    } else {
        res.render("index", {
            pageTitle: "login",
            isLoggedIn: false,
            MessageError: [{ param: 'Not Regisered' }],
            oldData: { email, password },
        });
    }
};
exports.accountSetting = async(req, res) => {
    res.render('accountSetting', {
        pageTitle: "accountSetting",
        MessageError: [],
        oldData: { oldPass: '', newPass: '', confirmPasswordAccSetting: '' },
        currentUser: req.session.firstName,
        userImage: req.session.userImg,
        MessageErr: ''
    })
};

exports.editPass = async(req, res) => {
    let err = validationResult(req)
    let { oldPass, newPass, confirmPasswordAccSetting } = req.body;
    const user = await User.findOne({ _id: req.session.userID });
    const match = await bcrypt.compare(oldPass, user.password);

    if (match) {
        if (err.isEmpty()) {
            bcrypt.hash(newPass, 8, async(err, hashPassword) => {
                newPass = hashPassword
                await User.updateOne({ _id: req.session.userID }, { "password": newPass })
                res.redirect('home')
            });
        } else {
            res.render("accountSetting", {
                pageTitle: "account Setting",
                MessageError: err.array(),
                oldData: { oldPass, newPass, confirmPasswordAccSetting },
                currentUser: req.session.firstName,
                userImage: req.session.userImg,
                MessageErr: ''
            }), console.log(err.array())

        }
    } else {
        res.render('accountSetting', {
            pageTitle: "account Setting",
            MessageErr: 'old password not correct',
            oldData: { oldPass, newPass, confirmPasswordAccSetting },
            currentUser: req.session.firstName,
            userImage: req.session.userImg,
            MessageError: []
        })
    }
};

exports.home = async(req, res) => {
    let usersPosts = await Post.find().populate('userID', '-_id -password');
    res.render("home", { pageTitle: req.session.userName, isLoggedIn: req.session.isLoggedIn, MessageError: [], usersPosts, currentUser: req.session.firstName, userImage: req.session.userImg });
};


exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('login')
    })
};

exports.notFound = (req, res) => {
    res.render("NotFound", { pageTitle: 'Not Found 404', currentUser: req.session.firstName, userImage: req.session.userImg });
};