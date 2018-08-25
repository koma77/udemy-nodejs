const {ObjectID} = require('mongodb');

const {mongoose} = require('./../db/mongoose');
const {Todo} = require('./../db/models/todo');
const {User} = require('./../db/models/user');


// "_id" : ObjectId("5b80e897bdd2850fd21e53b0"),
//var id = '5b80e897bdd2850fd21e53b0';
var id = '771b80e897bdd2850fd21e53b0';
var uID = '5b7fa6ad1e4b2503e6c7e192';

if (ObjectID.isValid(id)) {

Todo.find({
    _id: id
}).then((todos) => {
    console.log(todos);
})

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log(todo);
});

Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('Unable to find and ID');
    }
    console.log(todo);
}).catch((e) => console.log(e));

} else {
    console.log('ID is not valid!');
}

User.findById(uID).then((user) => {
    if(!user) {
        return console.log('User is not found');
    }
    console.log('User is: ', user);
}).catch((e) => {
    console.log(e);
});

