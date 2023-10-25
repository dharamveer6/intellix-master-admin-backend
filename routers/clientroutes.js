const express = require('express');
const { token_val } = require('../middlewares/token_val');
const { create_client, delete_aschool, add_admin_for_client, read_clients, get_url_by_code } = require('../controller/clientcontroller');


const clientRoute = express.Router();

clientRoute.route('/add/client').post(token_val,create_client);
clientRoute.route('/delete/client').post(token_val,delete_aschool);
clientRoute.route('/add/admin/for/client').post(token_val,add_admin_for_client);
clientRoute.route('/read/client').get(token_val,read_clients);
clientRoute.route('/get/url/by/school_code').post(get_url_by_code);






module.exports = {clientRoute};