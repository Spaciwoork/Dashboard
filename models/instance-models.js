const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const widgetSchema = new Schema({
    username: String,
    widgetname: String,
    content: String
});

const Widget = mongoose.model('widget', widgetSchema);

module.exports = Widget;