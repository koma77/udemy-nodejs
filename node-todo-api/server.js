
require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


var {mongoose} = require('./db/mongoose');

var {Todo} = require('./db/models/todo');
var {User} = require('./db/models/user');

const port = process.env.PORT || 3000;


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        //console.log('Todo saved: ', doc);
        res.status(201).send(doc);
    }, (e) => {
        //console.log('Unable to save a todo: ', e.name);
        res.status(500).send(e.name);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos)=>{
        res.send({todos});
    }, (e)=>{
        res.status(500).send(e);
    });
});


app.get('/todos/:id', (req, res) => {
    //res.send(req.params.id);
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send(`Invalid id: ${id}`);
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send(`Id is not found: ${id}`);
        }
        res.send({todo});
    }).catch((e) => {
        res.status(500).send(e);
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send(`Invalid id: ${id}`);
    }
    
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(204).send(`There is nothing to delete (id is not found): ${id}`);
        }
        res.send({todo});
    }).catch((e) => {
        res.status(500).send(e);
    });
});

app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(204).send(`There is nothing to update (id is not found): ${id}`);
        }
        res.send({todo});
    }).catch((e) => {
        res.status(500).send(e);
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})


module.exports = { app };
