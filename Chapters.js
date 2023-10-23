const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    data: [{
      Heading:{ 
            type: String,
            required:true,
        },
        Video_url: { 
            type:String,
            required:true
        },
        Release_Date: {
          type: String,
          required: true
        }
    }]
  },
  {timestamps:true},
  { versionKey: false }
);

const SessionModel = mongoose.model("Chapters", userSchema);
module.exports = SessionModel;


