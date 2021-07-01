const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatsSchema = new Schema({
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: [String],
        required: true
    },
    text: {
        type: String,
        required: true
    },
},{timestamps: true});

const Chat = mongoose.model("Chat",chatsSchema);

module.exports = Chat;