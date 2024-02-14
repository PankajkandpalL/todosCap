require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const { userRouter } = require('./routes/auth');
const { todoRouter } = require('./routes/todos');

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cors({
    origin: "*"
}));

app.get("/", (req, res)=>{
    res.send("Welcome to the Todo APP");
});

app.use('/auth/', userRouter);
app.use('/todos/', todoRouter);

// app.listen(8000, async()=>{
//     await mongoose.connect(process.env.MONGO_URI); 
//     console.log("Server running on port 8000");
// })

module.exports = app;