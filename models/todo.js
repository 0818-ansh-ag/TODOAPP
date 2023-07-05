const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
     uniqueid: {
        type: Number,
        required: true
     },
     taskname: {
        type: String,
        required: true
     }
})

const Todolist =  mongoose.model('Todolist', todoSchema);
module.exports = Todolist;