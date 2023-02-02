const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true, maxLength: 1000, minLength: 1 },
  date: { type: Date, required: true, default: Date.now },
  user: { type: String, required: true, maxLength: 50, minLength: 1 },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true }
});

CommentSchema.virtual("date_formatted").get(function () {
  return this.date ? DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED) : '';
});

// Export model
module.exports = mongoose.model("Comment", CommentSchema);