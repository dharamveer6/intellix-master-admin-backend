const knex = require("../db");


exports.up = function (knex) {
    return knex.schema.createTable('master_admin', (table) => {
      table.increments('id').primary();
      table.string('email').nullable();
      table.string('password').nullable();
      table.string('token').nullable();
      
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('master_admin');
  };