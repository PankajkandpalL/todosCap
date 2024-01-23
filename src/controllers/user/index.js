const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const {auth} = require('../../middlewares/auth');

const registerHandler = async(req,res)=>{
    const { name, email, password } = req.body;
    if(!name){
        return res.status(400).send({ error : true, message : "Name is required" });
    }
    if(!email){
        return res.status(400).send({ error : true, message : "Email is required" });
    }
    if(!password){
        return res.status(400).send({ error : true, message : "Password is required" });
    }
    try {
        // hash the password before storing it in the database
        const user = new User({ name, email, password }); 
        user.save();
        return res.status(201).send({ error : false, items : { data : user, message : "User created successfully" }});
    } catch (error) {
        return res.status(500).send({ error : true, message : error.message });
    }
}

const loginHandler = async(req,res)=>{
    const { email, password } = req.body;
    try {
        let isUser = await User.findOne({ email, password });
        if(!isUser){
            return res.status(500).send({ error : true, message : "Invalid credentials" });
        }
        const token = jwt.sign({ id : isUser._id, email : isUser.email }, "Secret1234", { expiresIn : 150000 } );
        return res.status(200).send({ error : false, items : { data : token, message : "User logged in successfully" }});
    } catch (error) {
        return res.status(500).send({ error : true, message : error.message });   
    }
}

module.exports = {registerHandler, loginHandler};