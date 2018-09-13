const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../db/models/todo');
const { User } = require('./../db/models/user');
const { ObjectID } = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');



const rndID = new ObjectID().toHexString();

beforeEach(populateUsers);
beforeEach(populateTodos);

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
               expect(res.text).toBe(`Id is not found: ${rndID}`);
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

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todos) => {
                    expect(todos).toNotExist;
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 204 if todo is not found', (done) => {
        request(app)
            .delete(`/todos/${rndID}`)
            .expect(204)
            .end(done);
    });

    it('should return 400 if id is invalid', (done) => {
        request(app)
            .delete('/todos/invalid_id')
            .expect(400)
            .end(done)
    });
});


describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = "Updated during the test";
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not complete', (done) => {
        var hexId = todos[1]._id.toHexString();
        var todo = todos[1];
        todo.completed = false;
        request(app)
            .patch(`/todos/${hexId}`)
            .send(todo)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist;
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('X-AUTH', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'user@example.com';
        var password = '123nm,!!!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['X-AUTH']).toExist;
                expect(res.body._id).toExist;
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist;
                    expect(user.password).not.toBe(password);
                    done();
                });
            });

    });

    it('should return validation error if user is invalid', (done) => {
        var email = 'example.com';
        var password = '123nm,!!!'; 

        request(app)
            .post('/users')
            .send({email, password})
            .expect(500)
            .end(done);
    });

    it('should not create a user if email in use', (done) => {
        var email = users[0].email;
        var password = '123nm,!!!'; 
        request(app)
            .post('/users')
            .send({email, password})
            .expect(500)
            .end(done);
    });
});