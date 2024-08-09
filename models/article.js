const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    thumbnail: { 
        type: String, 
        default: ""
    },
    author: { 
        type: [Schema.Types.ObjectId], 
        ref: "Agent"
    },
    access: { 
        type: Object, 
        required: true
    },
    published: {
        type: Boolean,
        default: false
    },
    category: {
        type: Array,
        default: []
    },
    tags: {
        type: Array,
        default: []
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
