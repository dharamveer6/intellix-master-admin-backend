const jwt = require("jsonwebtoken");
const util = require("util");

const { trycatch } = require("../utils/try_catch_handler");
const { CreateError } = require("../utils/create_err");

const verifyJwt = util.promisify(jwt.verify);

var token_val = async (req, res, next, transaction) => {
  const token = req.header("authorization");
  const tokenParts = token ? token.split(" ") : [];
  if (!tokenParts) {
    throw new CreateError("TokenError", "Header is empty");
  }

  try {
    const decoded = await verifyJwt(tokenParts[1], process.env.private_key);
    

    req.admin_id = decoded.id;

    var { token: comp_token } = await transaction("master_admin")
      .select("token")
      .where("id", decoded.id)
      .first();

    if (tokenParts[1] !== comp_token) {
      throw new CreateError("Token Error", "token not match");
    }
    next();
  } catch (error) {
    throw new CreateError("TokenError", "Invalid Token");
  }
};

token_val = trycatch(token_val);

module.exports = {token_val};
