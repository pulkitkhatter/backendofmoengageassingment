const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  codes: [
    {
      type: String,
      required: true,
    },
  ],
  imageLinks: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastSaved: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("List", ListSchema);
