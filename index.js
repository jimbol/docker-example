const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(bodyParser.json());
mongoose.connect('mongodb://mongo:27017/todos', {
  useNewUrlParser: true,
});
const connection = mongoose.connection;

connection.once('open', function() {
  console.log('MongoDB connection established');
});

todoRoutes.route('/test').get(function(req, res) {
  res.json({
    status: 200,
    works: true,
  });
});
todoRoutes.route('/').get(function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      console.error(err);
    }
    res.json(todos);
  });
});

todoRoutes.route('/:id').get(function(req, res) {
  Todo.findById(function(err, todo) {
    res.json(todo);
  });
});

todoRoutes.route('/add').post(function(req, res) {
  let todo = new Todo(req.body);
  todo.save()
    .then((todo) => {
      res.status(200).json(todo);
    })
});

todoRoutes.route('/update/:id').post(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    todo.description = req.body.description;
    todo.completed = req.body.completed;
    let newTodo = new Todo(todo);
    newTodo.save()
      .then((updatedTodo) => {
        res.status(200).json(updatedTodo);
      })
  });
});

app.use('/todos', todoRoutes);
app.listen(PORT, function() {
  console.log('Server is running on Port:', PORT);
});

