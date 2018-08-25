const { MongoClient, ObjectID } = require('mongodb');

var obj = ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb');
    };
    console.log('Connected to mongodb');

    const db = client.db('TodoApp');


    //deleteMany
    //deleteOne
    //findOneAndDelete

/*
    db.collection('Todos').deleteMany({ text: 'Eat lunch' }).then((result) => {
            console.log(result);
    });
*/

/*
    db.collection('Todos').deleteOne({ text: 'Eat lunch' }).then((result) => {
        console.log(result);
    });
*/

    db.collection('Todos').findOneAndDelete({ completed: false}).then((result) => {
        console.log(result);
    });

    //client.close();
});