const axios = require('axios');

const express = require('express');
const Router = express.Router();

const apiKey = process.env.API_KEY;
const options ={
    headers:{
        'Authorization':`Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    },
    body:{
        "addr":"1Jg4oRYVK6AUh7NkWbGqW9XXqmUtVvbVqQ 1MFEXujvDzi5uAcfFoiFeRkrVFAiw5rDBr 14pXDYF1bdioEFkPdndsEYNdvMxa9kG4Xn"
    }
};
Router.get('/',async (req,res,next)=>{

 axios.post(`https://blockonomics.co/api/balance`,{headers: options.headers, data:options.body})
        .then(result=>res.send(result))
        .catch(err=>res.send(err))

});

module.exports = Router;


