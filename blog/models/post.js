const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 160, minLength: 1 },
  text: { type: String, required: true, minLength: 1 },
  date: { type: Date, required: true, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isPublished: { type: Boolean, default: false }
});

PostSchema.virtual("date_formatted").get(function () {
  return this.date ? DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED) : '';
});

// Export model
module.exports = mongoose.model("Post", PostSchema);