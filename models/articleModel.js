const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: false,
  },

  category: {
    type: String,
    required: true,
    enum: ["Politics", "Sports", "Space", "Health", "Technology"],
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

articleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
