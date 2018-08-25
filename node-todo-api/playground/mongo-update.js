const { MongoClient, ObjectID } = require('mongodb');

var obj = ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb');
    };
    console.log('Connected to mongodb');

    const db = client.db('TodoApp');


    /*
    db.collection('Todos').findOneAndUpdate({ text: "Eat lunch" },
        { $set: { text: "Eat 2 lunch" }},
        { returnOriginal: true }
    ).then((res) => {
        console.log(res);
    });
    */

    db.collection('Users').findOneAndUpdate( { name: 'Andrey' }, { $set: { name: 'Andrew'}, 
    $inc: { age: 1} }, { returnOriginal: false }).then((res) => { console.log(res)});

    //client.close();
});