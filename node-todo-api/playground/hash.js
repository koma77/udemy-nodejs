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