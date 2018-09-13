
const {ObjectID} = require('mongodb');

const {Todo} = require('../../db/models/todo');
const {User} = require('../../db/models/user');

const jwt = require('jsonwebtoken');

const todos = [{
    text: 'First test todo',
    _id: new ObjectID
}, {
    text: 'Second test todo',
    _id: new ObjectID,
    completed: true,
    completedAt: 333
}, {
    text: 'Third test todo',
    _id: new ObjectID
}]

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};


const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [{
    _id: userOneID,
    email: 'andrey123@some.mail',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoID,
    email: 'andrey321@some.mail',
    password: 'userTwoPassword'
}]

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all(['userOne', 'userTwo']);
    }).then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers};