const axios  = require('axios');
async function getCountries() {
     const genUniversalToken = 'Z9FvIK4-lhGzkE9LNOAONYZpmcrn4Tt5JEyP3z27_qd-lHTqXAyRAn0eaYEfYbrZyK0';
     // Z9FvIK4-lhGzkE9LNOAONYZpmcrn4Tt5JEyP3z27_qd-lHTqXAyRAn0eaYEfYbrZyK0
     console.log(genUniversalToken)
     return  await axios.get("https://www.universal-tutorial.com/api/getaccesstoken", {
         headers: {
             "Accept": "application/json",
             "api-token": genUniversalToken,
             "user-email": "doomrumrum@gmail.com"
         }
     }).then(result => {
         console.log(result)
         const tk = result.data.auth_token;
         return axios.get("https://www.universal-tutorial.com/api/countries/", {
             headers: {
                 'Authorization': 'Bearer ' + tk,
                 "Accept": "application/json"
             }
         }).then(countries => countries).catch(e => e)
     }).catch(e => e)
 }

module.exports = getCountries;