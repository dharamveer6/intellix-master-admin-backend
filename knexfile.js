require('dotenv').config();
module.exports={
  
  development: {
    client: 'mysql',
    connection: {
      host:process.env.db_hostname,
      user:process.env.db_user,
      password:process.env.db_password,
      database:process.env.db_name,
    },
    migrations: {
      directory: './migrations'
    },
    
    pool: {
      min: 2, 
      max: 10, // Maximum number of connections in the pool
      idleTimeoutMillis: 10000, // How long a connection is allowed to be idle before it's closed
      acquireTimeoutMillis: 30000, // How long to wait for a connection from the pool before timing out
    },
  },
};