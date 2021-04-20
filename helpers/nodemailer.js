const mailer = require('nodemailer');

const content = `

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
    color: red;
    }
</style>
</head>
<body>
    <h2>This is to inform u of our meeting</h2>
</body>
</html>
;`

async function emailSender(req,res,next) {
    // let testAccount = await mailer.createTestAccount();
        let transporter = mailer.createTransport({
            host: "mail.privateemail.com",
            port: 465,
            secure: true,
            auth:{
                user:'ting@okechukwuomeh.xyz',
                pass: '*omeh*4769#',
            },
            dkim:{
                domainName: 'okechukwuomeh.xyz',
                keySelector: '2017',
                privateKey: process.env["EmailPrivateKey "],
                cacheDir: false
            },
            attachments:[
                {
                    filename: 'logo.png',
                    path: __dirname + "/logo.png",
                    cid: 'logo.png'
                }
            ]
        });

         const emailDetails = {
             from: '"Luke Shaw" <ting@okechukwuomeh.xyz>',
             to: "okibe4obinna@gmail.com",
             subject: "Hello world",
             text: "Hello world",
             html: content
         }
        let info = await transporter.sendMail(emailDetails,(error,data)=>{
            if (error){
                console.log(error)
                res.send(error)
            }else{
                res.send('success')
            }

        });



    console.log("preview URL:%s", mailer.getTestMessageUrl(info))
  // next();
}

module.exports = emailSender;