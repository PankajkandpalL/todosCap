const express = require('express');
const jwt = require('jsonwebtoken');

function auth(req,res,next){
   
    if(!req.headers.authorization){
        return res.status(500).send("Invalid User");
    }
    const { authorization } = req.headers;
    
    const token = req.headers.authorization;
    const verified = jwt.verify(token, "Secret1234");

    if(verified){
        const { id, email } = verified;
        console.log(id, email);
        req.body.user = id;
        next();
    }
    else{
        return res.status(500).send("User not authorized");
    }

}


module.exports = {auth};