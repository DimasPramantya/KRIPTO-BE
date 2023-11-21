const express = require('express');
const { loginHandler, registerHandler } = require('../controller/user');
const userAuthorization = require('../middleware/userAuth');
const { createFolder } = require('../controller/file');
const router = express.Router();

router.post('/login', loginHandler)

router.post('/register', registerHandler);

router.post('/folder', userAuthorization, createFolder);

module.exports = router;