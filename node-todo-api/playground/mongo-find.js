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
        db.collection('Todos').find({ 
            _id: new ObjectID('5b7d127505b9770574bb9a05')
        }).toArray().then((docs) => {
                console.log('Todos:');
                console.log(JSON.stringify(docs, undefined, 2));
            }, (err) => {
                console.log('Unable to fetch data', err);
            }
        );
    */
/*
    db.collection('Todos').find().count().then((count) => {
        console.log('Todos count:', count);
    }, (err) => {
        console.log('Unable to fetch data', err);
    }
    );
*/

    db.collection('Users').find({ 
        name: 'Andrey'
    }).toArray().then((docs) => {
            console.log('Names:');
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log('Unable to fetch data', err);
        }
    );

    //client.close();
});