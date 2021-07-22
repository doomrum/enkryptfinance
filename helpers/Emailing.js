const nodeMailer = require('nodemailer');

class Emailing {
    constructor(emailType,emailHeader,emailMsg,emailAccount,mailedTo,route) {
        this.emailType = emailType;
        this.emailMessage = emailMsg;
        this.emailAccount = emailAccount;
        this.mailedTo = mailedTo;
        this.emailHeader = emailHeader;
        this.route = route;

        /*
        * mailedTo = {
          receiver,
         message,
         header,
         cidImg

       *
       *
       *
}        *
        * */

        ///email options
        this.emailOptions =  {
            from: `"${this.emailAccount.sender}" <${this.emailAccount.email}@enkryptfinance.com>`,
            to:   this.mailedTo.receiver,
            subject:   this.emailHeader.subject,
            text:   this.mailedTo.message,
            html: this.emailBody(this.mailedTo,this.emailType),
            attachments:[
                // {
                //     filename:this.emailMessage.cidName,
                //     path: this.emailMessage.imgPath,
                //     cid: this.emailMessage.cid
                // }
            ]
        }
    }
///EMAIL BODY FOR ALL EMAILS
    emailBody = function (toWhomData,type) {
let header = this.emailHeader;
        console.log(header)
            switch (type) {
                case "withdrawal":
                    return withdrawal(toWhomData)

                case "login":
                    return login(toWhomData)
                case "signUp":
                    return signUp(toWhomData)
                case "payment":
                    return payment(toWhomData)
                case "support":
                    return support(toWhomData)
                default:

            }

       function withdrawal (to){
             return (
                ``
            );
        }
        function login (data){
             return (
                 `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">
    <style>
        *,*::before,*::after{
            margin: 0;
            padding: 0;
            color: #2b2b41;

        }
        html{
            font-size: 30%;
            font-family: 'Roboto', sans-serif;
        }
        .center_img{
           width: 40%;
            margin: 0 auto;
            position: relative;
            text-align: center;
        }
        em{
            font-size: 2.8rem;
            font-weight: bold;
            color: #008bf8;
            font-style: normal;
        }
        .center_img-box{
            margin: 2rem auto;
            position: relative;
            text-align: center;
        }
        .h6{
            font-size: 4.8rem;
            text-align: center;
            font-weight: bold;
        }
        .h4{
            margin-top: 1rem;
            font-size: 2.4rem;
            text-align: center;

        }
        .icon{
      
            color: #f5b700;
        }

    </style>
</head>
<body>
  <div class="center_img-box">
        <h1>${data.header}</h1>
        <img alt="" class="center_img" src="https://res.cloudinary.com/enkryptfinance-com/image/upload/v1626988713/enkryptDocs/undraw_Opened_re_i38e_dawl7h.png"/>
        <h4 class="h6">New Login Alert <i class="la la-shield icon" ></i></h4>
      <p class="h4">You have a new login into your account <em>${data.message}</em> </p>
  </div>
</body>
</html>
`
            );
        }
        function signUp (data){

           return  (`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>email</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                color: #2b2b41;
                font-family: 'Roboto', sans-serif;
                text-align: center;
            }
        .mail-body{
            
        }
        .h4{
            font-size: 1.8rem;
        }
        .h6{
            font-size: 1.45rem;

        }
        .p{
            font-size: 1.6rem;
        }
        .mgT1{
            margin-top: 1rem;
        }
        .mgT2{
            margin-top: 2rem;
        }
        .mgT4{
            margin-top: 4rem;
        }
        .sub-h{
            font-size: 1.8rem ;
            font-weight: bold;
        }
        .main-img{
            width: 100%;
        }
        .pdv1{
            padding: 1rem 0;
        }
        .bottomg_greet{
            background-color: lavender;
            float:right;
            padding: 1rem;
            border-radius: 1.5rem;
            width: 100%;
        }
        
.btn {
  color: white!important;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 2em;
  cursor: pointer;}
  .btn-primary{
    background-color: #f5b700;
    border: none;
    transition: all 0.4s cubic-bezier(1, 0.2, 0.54, 0);
    
  }
  .btn:hover{
  background-color: #ffc005;
  }
  .mgT2{
  margin-top: 2rem;
  }
    </style>
</head>
<body>

   <div class="mail-body">
       <h2 class="h4">${data.header}</h2>
       <div class="mgT2">
           <img alt="" src='cid:${data.cid}' class="main-img"/>
       </div>
       
       <p class="mgT2 p">${data.message}</p>
       <h3 class="h6">
        Please Verify Your Email </h3>
        <a href='https://enkryptfinance.com/auth/verification/${header.id}' class="btn btn-primary mgT2">Verify Email</a>
          
         <p style="font-size: 1rem; margin-top: 2rem">Or copy link to verify</p>
         <p style="color: #008bf8; font-size: 1.1rem">https://enkryptfinance.com/auth/verification/${header.id}</p>
   </div>

</body>
</html>
`);
        }




        function payment (to){
          return (
                ``
          );
        }
        function support (to){
            return (
                ``
            );
        }

    }


    sendEmail  = async function(){
        let  transporter =  nodeMailer.createTransport({
            host: "mail.privateemail.com",
            port: 465,
            secure: true,
            auth:{
                user: 'support@enkryptfinance.com',
                pass:'support@12345',
            },
            dkim:{
                domainName: 'enkryptfinance.com',
                keySelector: '2017',
                privateKey: process.env["EmailPrivateKey "],
                cacheDir: false
            },

        });


        await transporter.sendMail(this.emailOptions,(error,data)=>{
            if (error){
                console.log(error)
                return error
            }else{
                this.route.req.flash('success_message','account created successfully');
                this.route.res.redirect(this.emailHeader.redirect);
            }

        });
    }


}

module.exports = Emailing;