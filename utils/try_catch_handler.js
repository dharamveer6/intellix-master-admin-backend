const knex = require("../db");


const trycatch = (controller) => {
    return async (req, res, next) => {
      try {

        var transaction = await knex.transaction();
        await controller(req,res,next,transaction);
        console.log("in try block check pool")
        await transaction.commit(); 
      } catch (err) {
        console.log(err);
       
        await transaction.rollback();
        console.log("in catch block check pool")
        console.log(err)
        // If the error is a Joi validation error
        if (err.name === 'ValidationError') {
          return res.send({ status:"VAL_ERR", Backend_Error:err.message });
        }
        // If the error is a transaction error
       else if (err.name === 'TransactionError') {
          // Send the transaction error message
          return res.send({ status:"TXN_ERR", Backend_Error: err.message });
        }
        else if (err.name === 'FileUploadError') {
          // Send the transaction error message
          return res.send({ status:"FILE_ERR", Backend_Error: err.message });
        }

        else if(err.name === 'CustomError'){
          return res.send({ status:"CUSTOM_ERR", Backend_Error: err.message });
        }

        else if(err.name === 'TokenError'){
          return res.send({ status:"TOKEN_ERR", Backend_Error: err.message });
        }
        else{
          return res.send({ status:"INT_ERR",  Backend_Error: err.message });
        }
  
        // For other types of errors, send the error message
        
      }
    };
  };
  
  module.exports = { trycatch };
  