const { check, validationResult } = require('express-validator')


exports.registrationValidation = [
    check('firstName', 'lastName', 'invalid name').matches(/^([a-z])+$/),
    check('userName', ` userName should 5-10 characters,
    no '_' or '.' '__' '_.' '._'`).matches(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/),
    check('email', 'invalid email format').isEmail(),
    check('password', '').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/),
    check('confirmPassword', 'invalid').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password does not match');
        }
        return true;
    })
]

/* ^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$*/