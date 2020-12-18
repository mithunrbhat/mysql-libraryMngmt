const express = require('express');
const jwt = require('jsonwebtoken');
const keys = require('./config/keys');
const statusCodes = require('./constants/statusCodes');
const router = express.Router();
const libraryController = require('./controllers/library-controller');
const userController = require('./controllers/user-controller');

router.use(function timeLog(req, res, next) {
    console.log(`Time: ${Date.now()} : Requests ${req.url}`);
    next();
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['token'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, keys.jwt.secretKey, (err, authData) => {
            if (!err) {
                req.authData = authData;
                next();
            } else {
                res.status(200).send({status: statusCodes.TOKEN_EXPIRED});
            }
        });
    } else {
        res.status(500).send({message: 'Please login / register to add, delete the data'});
    }
}

// router.post('/signin', userController.signIn);
// router.post('/signup', userController.signUp);
router.get('/:category', libraryController.getAll);
router.get('/:category/:id', libraryController.getById);
router.post('/:category', libraryController.addItem);
// router.delete('/:category/:id', verifyToken, libraryController.deleteItem);

module.exports = router;