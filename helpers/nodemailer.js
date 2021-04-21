const mailer = require('nodemailer');



function createContent(data){
  return (`

<html>
    <head>
    <style>
   html {
    background-color: #f7f7f7;
    
    
    }
    *{
    padding: 0;
    border: 0;
    box-sizing: border-box;
    }
    h1,h2,h3,h4,h5,h6{
       color: #262626;
    }
    h2{
    font-size: 3rem;
    color: #1d158d;
    
    }p{
    font-size: 2.4rem;
    font-weight: bold;
    margin-top: 1rem;
    }
    .sign{
      font-size: 1.8rem;
      margin-top: 1rem;
    }
</style>
</head>
<body>
    <h2>${data.header}</h2>
     <img alt="" class="logo" src='cid:${data.cid}'/>
    <p>${data.body}</p>
       <img alt="" class="bodyImg" src='cid:${data.cidBody}'/>
    <div class="sign">
      Thanks Management
     </div>
  
</body>
</html>
`);
}

async function emailSender(params) {
    // let testAccount = await mailer.createTestAccount();

        let transporter = mailer.createTransport({
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
                privateKey: process.env["EmailPrivateKey"],
                cacheDir: false
            },

        });

         const emailDetails = {
             from: `"${params.sender}" <support@enkryptfinance.com>`,
             to: params.client,
             subject: params.subject,
             text: params.text,
             html: createContent(params.data),
             attachments:[
                 {
                     filename:params.data.imgName,
                     path: params.data.imgPath,
                     cid: params.data.cid
                 },
                 {
                     filename:params.data.imgNameBody,
                     path: params.data.imgPathBody,
                     cid: params.data.cidBody
                 }
             ]
         }
      await transporter.sendMail(emailDetails,(error,data)=>{
            if (error){
                console.log(error)
               return error
            }else{
                return data
            }

        });



    // console.log("preview URL:%s", mailer.getTestMessageUrl(info))
  // next();
}

module.exports = emailSender;