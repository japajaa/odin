#! /usr/bin/env node

console.log('This script populates some test dishes and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async')
const Dish = require('./models/dish')
const Category = require('./models/category')


const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const categories = []
const dishes = []

function categoryCreate(name, type, cb) {
  const category = new Category({ name: name, type: type });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function dishCreate(name, servings, category, cb) {
  dishdetail = { 
    name: name,
    servings: servings,
    category: category
  }
  if (category != false) dishdetail.category = category
    
  const dish = new Dish(dishdetail);    
  dish.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Dish: ' + dish);
    dishes.push(dish)
    cb(null, dish)
  }  );
}

function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate("Liha", "Ruokavalio", callback);
        },
        function(callback) {
          categoryCreate("Vege", "Ruokavalio", callback);
        },
        function(callback) {
          categoryCreate("Kala", "Ruokavalio", callback);
        },
        function(callback) {
          categoryCreate("Keitto", "Valmistustapa", callback);
        },
        function(callback) {
          categoryCreate("Grilli", "Valmistustapa", callback);
        },
        ],
        // optional callback
        cb);
}


function createDishes(cb) {
    async.parallel([
        function(callback) {
          dishCreate('Jartsburger', 1, [categories[0], categories[4]], callback)
        },
        function(callback) {
          dishCreate('Pho', 1, [categories[0], categories[3]], callback)
        },
        function(callback) {
          dishCreate('Pasta Arrabiata', 1, [categories[1]], callback)
        }
        ],
        // optional callback
        cb);
}


async.series([
    createCategories,
    createDishes
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Dishes: '+ dishes);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});