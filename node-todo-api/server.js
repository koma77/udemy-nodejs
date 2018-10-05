
require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {authenticate} = require('./middleware/authenticate');


var {mongoose} = require('./db/mongoose');

var {Todo} = require('./db/models/todo');
var {User} = require('./db/models/user');

const port = process.env.PORT || 3000;


var app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        //console.log('Todo saved: ', doc);
        res.status(201).send(doc);
    }, (e) => {
        //console.log('Unable to save a todo: ', e.name);
        res.status(500).send(e.name);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos)=>{
        res.send({todos});
    }, (e)=>{
        res.status(500).send(e);
    });
});


app.get('/todos/:id', authenticate, (req, res) => {
    //res.send(req.params.id);
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid id: ${id}`);
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send(`Id is not found: ${id}`);
        }
        res.send({todo});

    }).catch((e) => {
        res.status(500).send(e);
    });
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send(`Invalid id: ${id}`);
    }

    try {
      const todo =  await Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
      });
      if (!todo) {
        return res.status(404).send(`There is nothing to delete (id is not found): ${id}`);
      }
      res.send({todo});
    } catch(e) {
      res.status(500).send(e);
    }
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    //console.log(body);
    if (!ObjectID.isValid(id)) {
        return res.status(400).send(`Invalid id: ${id}`);
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send(`There is nothing to update (id is not found): ${id}`);
        }
        res.send({todo});
    }).catch((e) => {
        res.status(500).send(e);
    });
});


app.post('/users', async (req, res) => {
    var user = new User(_.pick(req.body, ['email', 'password']));

    try {
      await user.save();
      const token = await user.generateAuthToken();
      res.header('X-AUTH', token).send(user.toJSON());
    } catch(e) {
      //console.log('Unable to save user: ', e);
      res.status(500).send(e.errmsg);
    };
});

app.post('/users/login', async (req,res) => {
    const body = _.pick(req.body, ['email', 'password']);
    //res.send(body);
    try {
      const user = await User.findByCredentials(body.email, body.password);
      const token = await user.generateAuthToken();
      res.header('X-AUTH', token).send(user.toJSON());
    } catch(e) {
      res.status(404).send(e);
    };
});


app.get('/users/me', authenticate, (req, res) => {
   res.send(req.user);
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(500).send('Can not logout');
  }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});



module.exports = { app };
