const { createTodoHandler, updateTodoHandler, deleteTodoHandler, getTodosHandler } = require("../../controllers/todo");
const { auth } = require("../../middlewares/auth");
const Todo = require("../../models/todo");

const express = require('express');
const todoRouter = express.Router();

todoRouter.post("/", auth, createTodoHandler)

todoRouter.get("/", auth, getTodosHandler)

todoRouter.patch("/:id", auth, updateTodoHandler)

todoRouter.delete("/:id", auth, deleteTodoHandler)

module.exports = { todoRouter};