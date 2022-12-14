const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)
const jwt = require('jsonwebtoken')
const Models = require('./models/user.model')
const bcrypt = require('bcryptjs')

app.use(cors())
app.use(express.json())
app.get("/hello",(req,res)=>{
    res.status(200).send("Hello");
})

app.post('/api/register', async (req,res)=>{
    try{
        const newPassword = await bcrypt.hash(req.body.password, 10)
        const user = await Models.UserData.create({
            name:req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        const createClass = await Models.Classes.create({
            name:req.body.name,
            email: req.body.email,
            sec: "A"
        })
        const createClass1 = await Models.Classes.create({
            name:req.body.name,
            // email: req.body.email,
            sec: "B"
        })
        res.json({status:"ok"})

    } catch(error){
        res.json({status: 'error', error})
    }
})

app.post('/api/login', async (req,res)=>{
    const user = await Models.UserData.findOne({
        email:req.body.email,
    })
    if(!user) return res.json({status:"error" , error: "Invalid login"})
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    if(isPasswordValid){ 
        const token = jwt.sign({
            email:user.email
        }, 'dfsdsfddf')
        return res.json({status:"ok", user : token })
    } else{
        return res.json({status: 'error', user: false})
    }
})



app.post('/dashboard', async(req,res)=>{
    const user = await Models.Classes.findOneAndUpdate({
        email:req.body.email,
    })
    res.send(user)
})

app.get('/dashboard', async (req,res)=>{
    const token = req.headers['x-access-token']

    try{
        const decoded = jwt.verify(token, 'dfsdsfddf')
        const email = decoded.email
        const user = await  Models.Classes.findOne({email:email})
        const topics = await Models.Topics.find({classId:user._id})
        return res.json({status : "ok",topics: topics})
    }catch(error){
        console.log(error);
        res.json({status:'error', error: 'invalid token'})
    }
})
app.get('/topicsCovered/:id', async (req,res)=>{
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'dfsdsfddf')
        const email = decoded.email
        const user = await  Models.Classes.findOne({email:email})
        const topics = await Models.Topics.find({classId:user._id,sec: req.params.id})
        console.log(topics);
        // console.log(token);
        return res.json({status : "ok",topics: topics})
    }catch(error){
        console.log(error);
        res.json({status:'error', error: 'invalid token'})
    }
})

app.post('/topicsCovered', async (req,res)=>{
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'dfsdsfddf')
        const email = decoded.email
        const user = await  Models.Classes.findOne({email:email,sec: req.body})
        const topics = await Models.Topics.updateOne({classId:user._id,$set:{ quote: req.body.quote}})
        console.log(topics);
        return res.json({status : "ok",topics: topics})
    }catch(error){
        console.log(error);
        res.json({status:'error', error: 'invalid token'})
    }
})
app.post('/createTopic',async (req,res)=>{
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'dfsdsfddf')
        const email = decoded.email
        // const topicUpdate = await  Models.Classes.updateOne({email:email, $set:{topic:req.body.data}})
        // const addTopic = await  Models.Classes.updateOne({email:email, $set:{topic:req.body.data}})
        const user = await  Models.Classes.findOne({email:email,sec:req.body.sec})
        console.log(user);
        const topic = await Models.Topics.create({
            classId:user._id,
            sec:req.body.sec,
            class:req.body.class,
            topicName: req.body.topic,
            questions:req.body.questions,
            date:req.body.date
        })
        const updated = await Models.Topics.findOne({email:email,sec:req.body.sec})
        return res.json({status : "ok", latestTopics: updated})
    }catch(error){
        console.log(error);
        res.json({status:'error', error: 'invalid token'})
    }
})
app.post('/createClass',async (req,res)=>{
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'dfsdsfddf')
        const email = decoded.email
        // const topicUpdate = await  Models.Classes.updateOne({email:email, $set:{topic:req.body.data}})
        // const addTopic = await  Models.Classes.updateOne({email:email, $set:{topic:req.body.data}})
        const user = await  Models.UserData.findOne({email:email})
        console.log(user);
        const createClass = await Models.Classes.create({
            name:user.name,
            email: user.email,
            sec: req.body.sec
        })
        const updated = await Models.Topics.findOne({email:email,sec:req.body.sec})
        return res.json({status : "ok", latestTopics: updated})
    }catch(error){
        console.log(error);
        res.json({status:'error', error: 'invalid token'})
    }
})


app.listen("3001", ()=>{
    console.log("listening at 3001");
})