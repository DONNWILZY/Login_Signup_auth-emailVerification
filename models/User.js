const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: String,
    email: String,
    phone: Number,
    dateOfBirth: Date,
    gender: String,
    password: String
})

const USer = mongoose.model('User');
