const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('userJWT');
    console.log(token);
    if (token && token != null && token != undefined) {
        jwt.verify(token, 'simplePr', (err, decoded) => {
            if (err) {
                res.json(err)
            } else {
                next()
            }
        })
    } else {
        res.json('No Token Provided ')
    }
}