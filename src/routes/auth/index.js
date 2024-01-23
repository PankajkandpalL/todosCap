const express = require('express');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const { registerHandler, loginHandler } = require('../../controllers/user');

const userRouter = express.Router();

userRouter.post("/register", registerHandler)

userRouter.post("/login", loginHandler);

module.exports = {userRouter};