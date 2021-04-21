const mailer = require('nodemailer');



function createContent(data,user){
  return (`
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
    </style>
</head>
<body>

   <div class="mail-body">
       <h2 class="h4">${data.header}</h2>
       <div class="mgT2">
           <img src='cid:${data.cidBody}' class="main-img"/>
       </div>
       
       <p class="mgT2 p">${data.body}</p>
       <div class="link"></div>

      <div class="bottomg_greet mgT2">
          <p class="h6 pdv1">Thanks Obi</p>
          <p class="h6 pdv1">CTO, EnkryptFinance</p>
      </div>

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
             html: createContent(params.data,params.user),
             attachments:[
                 // {
                 //     filename:params.data.imgName,
                 //     path: params.data.imgPath,
                 //     cid: params.data.cid
                 // },
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
                params.req.session.msg = "success account confirmed"
                params.res.redirect('/auth/login');
                // params.req.flash('success_message', `${params.user} welcome to enkrypt Finance`);
                // params.res.render('auth/login',{layout:'auth',title:'Enkryptfinance | login', success_msg: params.req.flash('success_message')});
                // return data
            }

        });




    // console.log("preview URL:%s", mailer.getTestMessageUrl(info))
  // next();
}

module.exports = emailSender;