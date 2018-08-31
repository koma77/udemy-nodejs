var env = process.env.NODE_ENV || 'development';
//console.log('ENV => ', env);

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/TodoApp';
} else if (env === 'test') {
    process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
    process.env.PORT = 3000;
}