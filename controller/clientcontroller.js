
const Joi = require("joi");


require('dotenv').config();
const axios = require('axios');
const { CreateError } = require("../utils/create_err");
const { trycatch } = require("../utils/try_catch_handler");

var create_client=async(req,res,next,transaction)=>{
    const schema = Joi.object({
        school_name: Joi.string().max(50).required(),
        url: Joi.string().max(50).required(),
        school_code:Joi.string().max(4).required(),
      });
    
      const { error } = await schema.validateAsync(req.body);
      // console.log(error,"dddddddddddddddddddddd")
    
      if (error) {
        throw new CreateError("ValidationError", error.details[0].message);
      }

      var {school_name,url,school_code}=req.body;

      




      const apiUrl =`${url}/check` ; // Replace with the actual API URL

      console.log(apiUrl)


      
  
  
  

  const response = await axios.get(apiUrl);
  const responseData = response.data;

  if (responseData["status"] == "8421") {
   
  } else {
    return res.send({status:0,msg:"url is not working properly"})
  }

      
      
      
      
     

        const data =await transaction("clients").select("*").where({url}).orWhere({school_code});
        console.log(data,"cccccccccccccccccccccccccccckkkkkkkkkkkkkkkkkkkkkkkk")

      if(data.length != 0){
       return res.send({status:0,msg:`either school code or the ul is already granted to another school`})
      }


      const a=await transaction("clients").insert(req.body);

      return res.send({status:1,msg:"school insert succesfully"})


}

var read_clients=async(req,res,next,transaction)=>{
  const data=await transaction("clients").select("*");

  res.send({status:1,data})
}


var delete_aschool=async(req,res,next,transaction)=>{
  const schema = Joi.object({
    school_id: Joi.number()
    .integer()
    .max(9007199254740991)
    .positive()
    .required()
    
  });

  const { error } = await schema.validateAsync(req.body);


  if (error) {
    throw new CreateError("ValidationError", error.details[0].message);
  }

  const b=await transaction("clients").del().where({id:req.body.school_id})

  res.send({status:1,msg:"delete succesfully"})


}

var add_admin_for_client=async(req,res,next,transaction)=>{
  const schema = Joi.object({
    email: Joi.string().max(50).required(),
    name: Joi.string().max(50).required(),
    password: Joi.string().max(50).required(),
    school_id:Joi.number()
    .integer()
    .max(9007199254740991)
    .positive()
    .required()
  });

  const { error } = await schema.validateAsync(req.body);
  // console.log(error,"dddddddddddddddddddddd")

  if (error) {
    throw new CreateError("ValidationError", error.details[0].message);
  }

  const {email,password,school_id,name}=req.body

  const {url}=await transaction("clients").select("url").where({id:school_id}).first()


  const apiUrl =`${url}/admin/authentication/registor/admin` ; // Replace with the actual API URL
  console.log(apiUrl)


 


  const requestData = {name,email,password,name,master_admin_key:process.env.admin_key}
  
  const requestConfig = {
    headers: {
       // Replace with your actual authorization token
      'Content-Type': 'application/json', // Set the appropriate content type for your request
    },
  };

  const response = await axios.post(apiUrl, requestData, requestConfig);
  const responseData = response.data;

  if (responseData["status"]) {
    return res.send({ status: 1, msg: "admin added successfully" });
  } else {
   return res.send({ status: 0, msg: responseData["err"] });
  }


  







}

var get_url_by_code=async(req,res,next,transaction)=>{
  const schema = Joi.object({
    school_code: Joi.string().max(50).required(),
   
   
  });

  const { error } = await schema.validateAsync(req.body);
  // console.log(error,"dddddddddddddddddddddd")

  if (error) {
    throw new CreateError("ValidationError", error.details[0].message);
  }

  console.log(req.body.school_code)

  var url1=await transaction("clients").select("url").where({school_code:req.body.school_code}).first();

  if(url1){

    const {url}=url1;
    return res.send({status:1,url,msg:"changes or not"})

    

  }
  else{
    return res.send({status:0,msg:"invalid docker 2 2 school_code"})
  }

  
}


create_client=trycatch(create_client);
read_clients=trycatch(read_clients);
delete_aschool=trycatch(delete_aschool);
add_admin_for_client=trycatch(add_admin_for_client);
get_url_by_code=trycatch(get_url_by_code)

module.exports={create_client,read_clients,delete_aschool,add_admin_for_client,get_url_by_code}

