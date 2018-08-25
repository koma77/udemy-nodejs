const {MongoClient, ObjectID} = require('mongodb');

var obj = ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb');
    };
    console.log('Connected to mongodb');

    const db = client.db('TodoApp');

    /*     db.collection('Todos').insertOne({
            text: 'Something to do',
            completed: false
        }
            , (err, result) => {
                if (err) {
                    return console.log('Unable to insert a todo', err);
                }
                console.log('Record insterted', JSON.stringify(result.ops, undefined, 2));
            }); */

    db.collection('Users').insertOne({
        name: 'Andrey',
        age: 40,
        location: 'UAE'
    }, (err, res) => {
        if (err) {
            return console.log('Unable to insert doc', err);
        }
        console.log('Doc inserted', res.ops[0]._id.getTimestamp());
    });

    client.close();
});