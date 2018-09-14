
const {ObjectID} = require('mongodb');

const {Todo} = require('../../db/models/todo');
const {User} = require('../../db/models/user');

const jwt = require('jsonwebtoken');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const todos = [{
    text: 'First test todo',
    _id: new ObjectID,
    _creator: userOneID
}, {
    text: 'Second test todo',
    _id: new ObjectID,
    completed: true,
    completedAt: 333,
    _creator: userOneID,
}, {
    text: 'Third test todo',
    _id: new ObjectID,
    _creator: userTwoID
}]

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};




const users = [{
    _id: userOneID,
    email: 'andrey123@some.mail',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoID,
    email: 'andrey321@some.mail',
    password: 'userTwoPassword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoID, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}]

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all(['userOne', 'userTwo']);
    }).then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers};