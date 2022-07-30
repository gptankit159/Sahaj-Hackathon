const mongoose = require('mongoose')

const User = new mongoose.Schema({
    name:{type: String, required: true},
    email : {type: String, required: true, unique:true},
    password : {type: String, required: true},
})

const Class = new mongoose.Schema({
    name:{type: String, required: true},
    email : {type: String, required: true},
    sec :{type: String, required: true}
    // topic: {type: JSON},
})

const Topic = new mongoose.Schema({
    classId:{type: String, required: true},
    sec:{type: String, required: true}, 
    topicName: {type: String},
    questions:{type:JSON},
    date:{type:String}
})
const UserData = mongoose.model('UserData', User)
const Classes = mongoose.model('Classes', Class)
const Topics = mongoose.model('Topics', Topic)

module.exports = {
    UserData,Classes,Topics
}