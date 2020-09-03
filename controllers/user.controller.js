const User = require('../models/users').User;
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')

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
    } = req.body;
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
                    password: hashPassword
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
            res.render('profile', { pageTitle: 'profile' })
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

exports.profile = async(req, res) => {
    res.render("index", { pageTitle: req.session.userName, isLoggedIn: req.session.isLoggedIn, MessageError: [] });
};