var {User} = require('../db/models/user');

var authenticate = (req, res, next) => {
    var token = req.header('X-AUTH');
    User.findByToken(token).then((user) => {
        if (!user) {
            //res.status(401).send(e);
            //OR
            return Promise.reject();
        }  
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send(e);
    });
}

module.exports = {authenticate};