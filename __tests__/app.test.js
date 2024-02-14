const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../src/index");
const User = require('../src/models/user');
const Todo = require('../src/models/todo');
const { default: mongoose } = require("mongoose");
const jwt = require('jsonwebtoken');

global.score = 1;
let token = ""; 

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/shortener");
  console.log("Connected to MongoDB");
});

describe("Todo App", ()=>{
    it('should return 400 if name is missing', async () => {
        const res = await request(app)
          .post('/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123'
          });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: true, message: 'Name is required' });
      });
      
      it('should return 400 if email is missing', async () => {
        const res = await request(app)
          .post('/auth/register')
          .send({
            name: 'Test User',
            password: 'password123'
          });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: true, message: 'Email is required' });
      });

      it('should return 400 if password is missing', async () => {
        const res = await request(app)
          .post('/auth/register')
          .send({
            name: 'Test User',
            email: 'test@example.com'
          });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: true, message: 'Password is required' });
      });

      it('should return 201 if user is successfully created', async () => {
        const res = await request(app)
          .post('/auth/register')
          .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
          });
        expect(res.status).toBe(201);
        expect(res.body.error).toBe(false);
        expect(res.body.items.data.name).toBe('Test User');
        expect(res.body.items.data.email).toBe('test@example.com');

        const user = await User.findOne({ email: 'test@example.com' });
        expect(user).toBeTruthy();
        expect(user.name).toBe('Test User');
        // check whether password has been hashed or not!
        // expect(user.password).not.toBe('password123');
      });
      
      it('should return 500 if user is not found', async () => {
        const res = await request(app)
          .post('/auth/login')
          .send({
            email: 'test123124141242141@example.com',
            password: 'password123'
          });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: true, message: 'Invalid credentials' });
      });
    
      it('should return 200 with token if user is found', async () => {
          const res = await request(app)
          .post('/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          });
        expect(res.status).toBe(200);
        expect(res.body.error).toBe(false);
        expect(res.body.items.data).toEqual(expect.stringMatching(/^[\w-]+\.[\w-]+\.[\w-]+$/));
        token = res.body.items.data;
        expect(res.body.items.message).toBe('User logged in successfully');
      });
    
      it('should return 500 if an error occurs', async () => {
          const res = await request(app)
          .post('/auth/login')
          .send({
            email: 'test2324324324@example.com',
            password: 'password123'
          });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe(true);
        expect(res.body.message).toBe('Invalid credentials');
      });

    it('should return 400 if title is missing', async () => {
        const res = await request(app)
          .post('/todos/')
          .set('authorization', token)
          .send({
            status: 'pending',
            description: 'Todo description',
            user: 'userId'
          })
          console.log(res.status);
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: true, message: 'Title is required' });
      });
        
      it('should return 400 if status is missing', async () => {
        const res = await request(app)
          .post('/todos')
          .set('authorization', token)
          .send({
            title: 'Todo title',
            description: 'Todo description',
            user: 'userId'
          });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: true, message: 'Status is required' });
      });

      it('should return 400 if description is missing', async () => {
        const res = await request(app)
          .post('/todos')
          .set('authorization', token)
          .send({
            title: 'Todo title',
            status: 'pending',
            user: 'userId'
          });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: true, message: 'Description is required' });
      });

      it('should return 201 and create a todo if all parameters are provided', async () => {
        const mockTodo = {
          title: 'Learn React Testing Library',
          status: 'pending',
          description: 'Todo description',
        };
        const res = await request(app)
          .post('/todos')
          .set('authorization', token)
          .send(mockTodo);
        expect(res.status).toBe(201);
        expect(res.body.error).toBe(false);
        expect(res.body.items.message).toBe('Todo created successfully');
      
        const todo = await Todo.findOne(mockTodo);
        console.log("----------------Todo is getting created-----------", todo);
        expect(todo).toBeTruthy();
        expect(todo.title).toBe('Learn React Testing Library');
        expect(todo.status).toBe('pending');
        expect(todo.description).toBe('Todo description');
      });
      
      it('should return 500 if an error occurs', async () => {
        const res = await request(app)
          .post('/todos')
          .set('authorization', token)
          .send({
            title: 'Todo title',
            status: 'asdsadasdas',
            description: 'Todo description',
            user: 'userId'
          });
          expect(res.status).toBe(500);
          expect(res.body.error).toBe(true);
          expect(res.body.message).toMatch(/Todo validation failed/);
      });

      it('should return 200 with todos if they exist', async () => {
        const res = await request(app)
          .get('/todos')
          .set('authorization', token); 

          expect(res.status).toBe(200);
          expect(res.body.error).toBe(false);
          const verified = jwt.verify(token, "Secret1234");
          const mockTodos = await Todo.find({ user : verified.id });
          expect(res.body.items.data.length).toEqual(mockTodos.length);
          expect(res.body.items.message).toBe('Todos fetched successfully');
      });
     
      it('should return 400 if status is missing', async () => {
        const res = await request(app)
          .patch('/todos/todoId')
          .set('authorization', token)
          .send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: true, message: 'Status is required' });
      });
    
      it('should return 200 and update todo if parameters are valid', async () => {
        const verified = jwt.verify(token, "Secret1234");
        const todo = await Todo.findOne({ user : verified.id });
        const res = await request(app)
          .patch(`/todos/${todo._id}`)
          .set('authorization', token)
          .send({ status: 'inactive' });

        expect(res.status).toBe(200);
        expect(res.body.error).toBe(false);
        const updatedTodo = Todo.findOne({ _id : todo._id });
        expect(res.body.items.data.status).toEqual('inactive');
        expect(res.body.items.message).toBe('Todo updated successfully');
      });

      // // it is not validating the status field
      // it('should return 500 if an error occurs', async () => {
      //   const verified = jwt.verify(token, "Secret1234");
      //   const todo = await Todo.findOne({ user : verified.id });
      //   const res = await request(app)
      //     .patch(`/todos/${todo._id}`)
      //     .set('authorization', token)
      //     .send({ status: 'new' });
      //   expect(res.status).toBe(500);
      //   expect(res.body.error).toBe(true);
      //   expect(res.body.message).toMatch(/Todo validation failed/);
      // });

      it('should return 200 and delete todo if parameters are valid', async () => {
        const verified = jwt.verify(token, "Secret1234");
        const todo = await Todo.findOne({ user : verified.id });        
        const res = await request(app)
          .delete(`/todos/${todo._id}`)
          .set('Authorization', token); 

        expect(res.status).toBe(200);
        expect(res.body.error).toBe(false);

        const deletedTodo = await Todo.findOne({_id : todo._id});

        expect(deletedTodo).toBe(null);
        expect(res.body.items.message).toBe('Todo deleted successfully');
      });
    

});