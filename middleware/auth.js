module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn)
        res.render('index', { pageTitle: 'login', MessageError: [] })
    else next()
}