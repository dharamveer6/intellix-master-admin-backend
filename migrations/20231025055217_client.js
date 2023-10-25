const knex = require("../db");


exports.up = function (knex) {
    return knex.schema.createTable('clients', (table) => {
      table.increments('id').primary();
      table.string('school_code').nullable();
      table.string('url').nullable();
      table.string('school_name').nullable();
      
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('clients');
  };