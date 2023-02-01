const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 160, minLength: 3 },
  text: { type: String, required: true, maxLength: 160, minLength: 3 },
  date: { type: Date, required: true, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

MessageSchema.virtual("date_formatted").get(function () {
  return this.date ? DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED) : '';
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);