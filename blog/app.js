require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var authRouter = require('./routes/auth');
const passport = require('passport');

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGOURL || "mongodb://yourDbUrlShouldBeInDotenv";

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
// app.use('/users', usersRouter);
app.use('/users', passport.authenticate('jwt', {session: false}), usersRouter);
app.use('/posts', postsRouter);
module.exports = app;
