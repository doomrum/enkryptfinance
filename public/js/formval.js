const btn = document.getElementById('authBtn');
const formValid = false;
const pass = document.getElementById('password')
const phone = document.getElementById('phone')
const email = document.getElementById('email')
const plan = document.getElementById('plan')
const first= document.getElementById('first')
const middle = document.getElementById('middle')
const last = document.getElementById('last')
const country = document.getElementById('country')
const code = document.getElementById('code')
const terms = document.getElementById('terms')
const isPasswordSecure = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password.value);
};


const isValid = (item)=>{
    if (item.value.length>0 || item.value) {

        showSuccess(item);
        return true;
    }

    else{
        showError(item,'Must not be empty');
        return false;
    }


}
const isValidSelect = (item)=>{
    if (item.value) {
        showSuccess(item);
        return true;
    }

    else{
        showError(item,'Must not be empty');
        return false;
    }


}
const isValidTerm = (item)=>{
    if (item.value === 'on') {

        showSuccess(item);
        return true;
    }

    else{
        showError(item,'You must agree with terms');
        return false;
    }


}
const isValidPhone = (item)=>{
    if (item.value.length>5 && validPhone(item.value)) {
        showSuccess(item);
        return true
    }
    else{
        showError(item,'its not a valid number');
        return  false
    }
}
const checkPassword = (password)=>{
    if (isPasswordSecure(password)) {

        showSuccess(password);
        return true;
    }

    else{

        showError(password,'Invalid Password password must be a combination of Special Characters [@*#], numbers, small and  Capital Letters and 8 characters long');
        return false;
    }
};
const checkEmail = (email)=>{
    if (isEmailValid(email)) {

        showSuccess(email);
        return true;
    }

    else{

        showError(email,'Invalid Email');
        return false;
    }
};

const validPhone = (phone)=>{
    let reg = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im
   return  reg.test(phone);
}
const checkName = (fullName)=>{
          if (fullName.value.length>2) {
              showSuccess(fullName);
              return true;
          }

          else{

              showError(fullName,'Minimum length is 2 characters');
              return false;
          }


}
const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.value);
};

const isRequired = value => value !== '';
const showSuccess = (input) => {
    const nextSib = input.nextElementSibling;
    //check if it exists
    if (nextSib && input.name !== 'terms'){
       input.parentNode.removeChild(nextSib);
       input.parentNode.style.border = '2px solid  #5cd993';
    }
    if (nextSib&&input.name === 'terms'){
       input.parentNode.style.border = 'none';
    }
}
const showError = (input, message) => {
    // get the form-field element

    //check if element exists in parent
   const nextSib = input.nextElementSibling;

   //check if it exists
    if (nextSib){
        nextSib.innerText = message;
        input.parentNode.style.border = 'none';
    }else{
        //create element
        const errEl = document.createElement('small');
        errEl.classList.add('form-error')
        errEl.innerText = message;
        input.parentNode.appendChild(errEl);
        input.parentNode.style.border = 'none';
    }

}
const  form  = document.forms['signup'];
form.addEventListener('change',formValidity);

function formValidity(){
        // isValidPhone(phone)&&checkEmail(email)&&checkPassword(pass)&&checkName(first)&&checkName(middle)&&checkName(last)&&isValidTerm(terms)&&isValid(country)&&isValid(code)){
        let error = document.getElementById('small_error');
        if (checkEmail(email)===true &&isValidPhone(phone)===true
            &&checkPassword(pass)===true &&checkName(first)===true&&
            checkName(middle)===true&&checkName(last)===true
            && isValidSelect(plan)===true&&isValidTerm(terms)===true
            &&isValidSelect(country)===true&&isValidSelect(code)===true)
        {
            btn.disabled = false;
            if (error){
                form.removeChild(error);
            }

        }else{

            if (error){
                error.innerText = 'Please Make sure all the fields are filled'
            }else{
                const errEl = document.createElement('small');
                errEl.id = 'small_error'
                errEl.innerText = 'Please Make sure all the fields are filled';
                form.appendChild(errEl);
            }



    }
}
form.addEventListener('input',e=>{


    switch (e.target.name) {
        case "firstName":
           return checkName(e.target);
        case "middleName":
            return checkName(e.target);
        case "lastName":
            return checkName(e.target);
        case "email":
            return checkEmail(e.target);

        case "password":
            return checkPassword(e.target);
        case "country":
            return isValid(e.target);
        case "phone":
            return isValidPhone(e.target);
        case "plan":
            return isValid(e.target);

        case "terms":
            return isValidTerm(e.target);

        default:
            return false;
    }
})
if (formValid===false) btn.disabled = true;

