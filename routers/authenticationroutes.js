const express = require('express');
const { token_val } = require('../middlewares/token_val');
const { login, logout } = require('../controller/authenticationcontroller');



const authenticationRoute = express.Router();

authenticationRoute.route('/admin/login').post(login);
authenticationRoute.route('/admin/logout').post(token_val,logout);

module.exports = {authenticationRoute};