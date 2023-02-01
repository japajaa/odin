const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DishSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  servings: { type: Number, required: true, min: 1, max: 5 },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }]
});

// Virtual for dish's URL
DishSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/dishes/dish/${this._id}`;
});

// Export model
module.exports = mongoose.model("Dish", DishSchema);
