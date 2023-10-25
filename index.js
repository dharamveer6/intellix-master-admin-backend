const express = require('express');
const db = require('./db');



const cors=require('cors');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const path=require('path');
const { authenticationRoute } = require('./routers/authenticationroutes');
const { clientRoute } = require('./routers/clientroutes');








const app = express();
app.use(cors())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '5mb' }));
app.use(express.json());

app.use(authenticationRoute)
app.use(clientRoute)


// routes for the admins




// routes for the instructors


// routes for the student





// routes for the Hostel

app.use(async(err,req,res,next)=>{

  if(err.name === "FileValError"){
    return res.send({status:"FILE_VAL_ERR",Backend_Error:err.message})
  }

  console.log(err);
 
      res.send({ status:"INT_ERR",Backend_Error:err.message });
    
});

// app.use("/get",async(req,res)=>{
//   res.send({status:"6321", message:"there is no routes like this hit the correct route"});
// });



app.use("*",async(req,res)=>{
   res.send({status:"6320",Backend_Error:"there is no routes like this hit the correct route"});
 });

app.listen(process.env.port, ()=>{
  console.log(`server started on port ${process.env.port}`)
});
