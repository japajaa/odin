#! /usr/bin/env node

console.log('This script populates some test users and posts to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async')
const User = require('./models/user')
const Message = require('./models/message')


const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const messages = []
const users = []

function messageCreate(title, text, date, user, cb) {
  messagedetail = { 
    title: title,
    text: text,
    date: date,
    user: user
  }

  const message = new Message(messagedetail);
       
  message.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New message: ' + message);
    messages.push(message)
    cb(null, message);
  }   );
}

function userCreate(firstname, lastname, username, password, membershipStatus, cb) {
  userdetail = { 
    firstname: firstname,
    lastname: lastname,
    username: username,
    password: password,
    membershipStatus: membershipStatus
  }
    
  const user = new User(userdetail);    
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  }  );
}

function createMessages(cb) {
    async.series([
        function(callback) {
          messageCreate("Tärkeä tiedotus", "Varokaa byyttaa kodinhoitohuoneen matolla! YÖK!", Date.now(), users[0], callback);
        },
        function(callback) {
          messageCreate("Isi on ihana", "Isi on TODELLA ihana!!!!1", Date.now(), users[2], callback);
        },
        function(callback) {
          messageCreate("Kysynpähän vaan", "Onks kukaan nähnyt mun sukkia?", Date.now(), users[2], callback);
        },
        function(callback) {
          messageCreate("Pääsin Ekapelissä rantatasolle", "Olin ensin metsätasolla ja sit siellä oli sellainen violetti köntsä...", Date.now(), users[1], callback);
        },
        function(callback) {
          messageCreate("Olinko eka?", "Valvoja, olinko eka?", Date.now(), users[0], callback);
        },
        ],
        // optional callback
        cb);
}


function createUsers(cb) {
    async.parallel([
        function(callback) {
          userCreate('Jari', 'Reponen', 'jari@reponen.fi', 'moi', 'Admin', callback)
        },
        function(callback) {
          userCreate('Niilo', 'Reponen', 'niilo@reponen.fi', 'moi', 'Member', callback)
        },
        function(callback) {
          userCreate('Alma', 'Reponen', 'alma@reponen.fi', 'moi', 'Guest', callback)
        }
        ],
        // optional callback
        cb);
}


async.series([
    createUsers,
    createMessages
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Messages: '+ messages);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});