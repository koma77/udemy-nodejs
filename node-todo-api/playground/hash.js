const {SHA256}  = require('crypto-js');

var message = 'I am user number 3';
var hash = SHA256(message).toString();
console.log(message);
console.log(hash);


var data = {
    id: 4
}

var token = {
    data,
    hash: SHA256((JSON.stringify(data)+ `somepassword`).toString()).toString()
}

var resultHash = SHA256((JSON.stringify(data)+ `somepassword`).toString()).toString();

if (resultHash === token.hash) {
    console.log('Match');
}


const jwt = require('jsonwebtoken');

var data1 = {
    id: 5
}

var token1  = jwt.sign(data1, '123abc');


var decoded = JSON.stringify(jwt.verify(token1, '123abc'), undefined, 2);

console.log(`JWT token: ${token1} decoded: ${decoded}`);


const bcrypt = require('bcryptjs');
var password = '123abc!'
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    })
})

var hashedPassword = '$2a$10$CM9nOtIjainSsDQMKX58AOJlcXzaiENi7zHQQt1wQ7ypPSnp9RVrK';

bcrypt.compare(password, hashedPassword, (err, res) => {
    if (res) {
        console.log('fine, a match');
    }
});