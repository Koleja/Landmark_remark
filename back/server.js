require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Data = require('./data');
const User = require('./user');
const withAuth = require('./middleware');

const dbRoute = process.env.DB_ROUTE;
const secret = process.env.SECRET;

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });
let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());

/****** register/login part *******/

app.get('/api/secret', withAuth, function(req, res) {
  res.send('The password is potato');
});

// POST route to register a user
app.post('/api/register', function(req, res) {
  const { userName, userPass } = req.body;
  const user = new User({ userName, userPass });
  user.save(function(err) {
    if (err) {
      res.status(500)
        .send("Error registering new user please try again.");
    } else {
      // Issue token
      const payload = { userName };
      const token = jwt.sign(payload, secret, {
        expiresIn: '1h'
      });
      res.cookie('token', token, { httpOnly: true })
        .sendStatus(200);
    }
  });
});

// POST route to verify user
app.post('/api/authenticate', function(req, res) {
  const { userName, userPass } = req.body;
  User.findOne({ userName }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
        error: 'Internal error please try again'
      });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect email or password'
        });
    } else {
      user.isCorrectPassword(userPass, function(err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect email or password'
          });
        } else {
          // Issue token
          const payload = { userName };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true })
            .sendStatus(200);
        }
      });
    }
  });
});

// GET route to verify token
app.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200).send(res);
});

// POST route to log out user
app.post('/logout', (req, res) => {
  if (res) {
    res.cookie('token', {expires: Date.now()})
      .sendStatus(200);
  }
  res.redirect('/');
});


/********* handling notes part ***********/

// GET route to fetch notes from db
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// POST route to create note in db
router.post("/putData", (req, res) => {
  let data = new Data();
  const { id, content, position, author, title } = req.body;

  if ((!id && id !== 0) || !content || !position || !author || !title) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.title = title;
  data.author = author;
  data.position = position;
  data.content = content;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));