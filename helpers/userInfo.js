const userModel  = require('../models/user');
module.exports = function (ID) {

    console.log(ID)
    userModel.findOne({_id:ID})
       .then(user=> {
        // console.log(`${user} s here`);
        return user.toJSON();

    })
       .catch(err=>{
      return{error:err}
    })

}