const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../db/models/todo');
const { ObjectID } = require('mongodb');

const todos = [{
    text: 'First test todo',
    _id: new ObjectID
}, {
    text: 'Second test todo',
    _id: new ObjectID
}, {
    text: 'Third test todo',
    _id: new ObjectID
}]

const rndID = new ObjectID().toHexString();

beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo test';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(201)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return (done(err));
                }   

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should not create todo with invalid body data', (done) => {
        var text = '';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(500)
            .end((err, res) => {
                if (err) {
                    return (done(err));
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));
        });
    });


});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return id doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if id is not found', (done) => {
        request(app)
            .get(`/todos/${rndID}`)
            .expect((res) => {
               expect(res.text).toBe(`Id is not found: ${rndID}`)
            })
            .expect(404)
            .end(done);
    });

    it('should return 400 if id is not valid', (done) => {
        request(app)
            .get('/todos/123')
            .expect(400)
            .end(done);
    });
});