const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;