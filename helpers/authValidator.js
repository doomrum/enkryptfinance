const joi = require('joi');

function validateNewUser(data) {
     const schema = joi.object({
         fullName: joi.string().required().min(2),
         email:joi.string().email().required().min(6),
         password:joi.string().required().min(8)
     });
     return schema.validate(data);
}
function validateLogin(data) {
     const schema = joi.object({
         email:joi.string().email().required().min(6),
         password:joi.string().required().min(8)
     });
     return schema.validate(data);
}

module.exports = {
    validateNewUser,
    validateLogin
}