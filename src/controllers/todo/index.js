const express = require('express');
const jwt = require('jsonwebtoken');
const {auth} = require('../../middlewares/auth');
const Todo = require('../../models/todo');

const createTodoHandler = async(req, res)=>{
    const { title, status, description, user } = req.body;
    
    if(!title){
        return res.status(400).send({ error : true, message : "Title is required" });
    }
    if(!status){
        return res.status(400).send({ error : true, message : "Status is required" });
    }
    if(!description){
        return res.status(400).send({ error : true, message : "Description is required" });
    }

    try {
        const isTodo = new Todo({title, status, description, user});
        isTodo.save();
        return res.status(201).send({ error : false, items : { data : isTodo, message : "Todo created successfully" }});
    } catch (error) {
        return res.status(500).send({ error : true, message : error.message });
    }

}

const getTodosHandler = async(req, res)=>{
    try {
        const todos = await Todo.find({ user : req.body.user });
        return res.status(200).send({ error : false, items : { data : todos, message : "Todos fetched successfully" }});
    } catch (error) {
        return res.status(500).send({ error : true, message : error.message });
    }
}

const updateTodoHandler = async(req, res)=>{
    const { id } = req.params;
    const { status } = req.body;

    if(!status){
        return res.status(400).send({ error : true, message : "Status is required" });
    }

    try {
        const isTodo = await Todo.findByIdAndUpdate(id, { status });
        return res.status(200).send({ error : false, items : { data : isTodo, message : "Todo updated successfully" }});
    } catch (error) {
        return res.status(500).send({ error : true, message : error.message });
    }
}

const deleteTodoHandler = async(req, res)=>{
    const { id } = req.params;
    try {
        const isTodo = await Todo.findByIdAndDelete(id);
        return res.status(200).send({ error : false, items : { data : isTodo, message : "Todo deleted successfully" }});
    } catch (error) {
        return res.status(500).send({ error : true, message : error.message });
    }
}

module.exports = {createTodoHandler, getTodosHandler, updateTodoHandler, deleteTodoHandler};