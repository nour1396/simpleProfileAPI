const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const port = process.env.PORT || 1996;
const configDB = require('./config/db');
const mainRouting = require('./routes/main.routing');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: configDB.url,
    collection: 'userSessions'
});
//static path for css and javascript files
/* app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); */
/* //set view engine
app.set('views', 'views');
app.set('view engine', 'ejs'); */
//body parser
app.use(express.json());

//connect to mongoDB
mongoose.connect(configDB.url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}, (err) => { console.log('connected to DB ^_^ ' || err) });

//save session
app.use(session({
    secret: 'NourElkashef',
    resave: false,
    saveUninitialized: true,
    store
}));

//upload photos
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + Math.random() * 100 + file.originalname)
    }
});
app.use(multer({ dest: 'uploads', storage }).single('userImg'))

app.use(mainRouting);
//listening of port 
app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});