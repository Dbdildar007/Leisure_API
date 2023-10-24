const mongoose = require('mongoose');
const content = new mongoose.Schema(
  {
    data: [{
        Heading:{
            required:true,
            type:String
        },
        desc1:{
            required:false,
            type:String
        },
         desc2:{
            required:false,
            type:String
        },
        desc3:{
            required:false,
            type:String
        },
        desc4:{
            required:false,
            type:String
        },
        desc5:{
            required:false,
            type:String
        },
        desc6:{
            required:false,
            type:String
        },
        desc7:{
            required:false,
            type:String
        },
         desc8:{
            required:false,
            type:String
        },
        desc9:{
            required:false,
            type:String
        },
        desc10:{
            required:false,
            type:String
        },
        image_url1:{
            type:String,
            required:false
        },
        image_url2:{
            type:String,
            required:false
        },
        image_url3:{
            type:String,
            required:false
        },
        image_url4:{
            type:String,
            required:false
        },
        image_url5:{
            type:String,
            required:false
        },
        after_desc1:{
            type:String,
            required:false
        },
        after_desc2:{
            type:String,
            required:false
        },
        after_desc3:{
            type:String,
            required:false
        },
        after_desc4:{
            type:String,
            required:false
        }
    }]
  },
  {timestamps:true},
  { versionKey: false }
);

const Content = mongoose.model("ChapterContent", content);
module.exports = Content;





