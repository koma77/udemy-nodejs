const {ObjectID} = require('mongodb');

const {mongoose} = require('./../db/mongoose');
const {Todo} = require('./../db/models/todo');
const {User} = require('./../db/models/user');


//Todo.remove({}).then((result) => {
//    console.log(result);
//});

//Todo.findOneAndRemove({}).then((res) => {
//    console.log(res);
//});

//Todo.findOneAndRemove({}).then((res) => {
//    console.log(res);
//});

Todo.findOneAndRemove({ _id: '5b88d58da6a02f472d2d1d55'}).then((r) => {
    console.log(r);
});

//Todo.findByIdAndRemove('5b88d3f7a6a02f472d2d1d24').then((res) => {
//    console.log(res);
//});