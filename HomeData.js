const mongoose = require('mongoose');
const HomedataSchema = new mongoose.Schema(
  {
    poster_url: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    Rating: {
      type: String,
      required: true
    },
    Views: {
      type: String,
      required: true
    },
    Auther_name: {
      type: String,
      required: true
    },
    chapter_length: {
      type: String,
      required: true
    },
    chapters: [{
      chapter_id: String,
      chapter_name: String
    }
    ],
    About_course: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
  },
  { timestamps: true },
  { versionKey: false }
);
const HomeData = mongoose.model("HomeData",HomedataSchema);
module.exports = HomeData;

