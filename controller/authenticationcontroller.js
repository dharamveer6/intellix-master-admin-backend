const Joi = require('joi');
const { CreateError } = require('../utils/create_err');

// const { trycatch } = require('../../utils/try_catch_handler');
const util = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { trycatch } = require('../utils/try_catch_handler');
require("dotenv").config();

const signAsync = util.promisify(jwt.sign);

var login =async(req,res,next,transaction)=>{
   
        const schema = Joi.object({
          email: Joi.string().max(50).required(),
          password: Joi.string().max(50).required(),
        });
      
        const { error } = await schema.validateAsync(req.body);
        // console.log(error,"dddddddddddddddddddddd")
      
        if (error) {
          throw new CreateError("ValidationError", error.details[0].message);
        }
        const data = req.body;
        const query = await transaction
          .select("*")
          .from("master_admin")
          .where("email", data.email)
          .first();
      
        if (!query) {
          throw new CreateError("CustomError", "Invalid email");
        }
        console.log(query.password)
        console.log(data.password)
      
        const plainpass = data.password;
        var hashpass = query.password;
      
       
      
        const isMatch = bcrypt.compareSync(plainpass, hashpass);
        console.log(isMatch)
      
        if (isMatch) {
          const payload = {
            id: query.id,
          
          };
      
          try {
            const tok = await signAsync(payload, process.env.private_key, {
              expiresIn: "365d",
            });
      
            await transaction("master_admin").where("id", query.id).update({ token: tok });
      
            return res.send({
              status: 1,
              token: tok,
             
            });
          } catch (err) {
            throw new CreateError("CustomError", err.message);
          }
        } else {
          throw new CreateError("CustomError", "Invalid password");
        }
      };

      var logout = async (req, res, next, transaction) => {
        const query = await transaction("master_admin")
          .where("id", req.admin_id)
          .update({ token: null });
        res.send({ status: 1, message: "You have successfully logged out." });
      };

     logout=trycatch(logout);
     login=trycatch(login);


     module.exports={login,logout}
