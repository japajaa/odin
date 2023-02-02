const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true, maxLength: 100 },
  lastname: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, maxLength: 100 },
  isAdmin: { type: Boolean, default: false }
});

// Virtual for user's full name
UserSchema.virtual("fullname").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `${this.firstname} ${this.lastname}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
