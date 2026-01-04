const nodemailer = require('nodemailer');

const  transporter =  nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure : process.env.SMTP_SECURE,
    auth : {
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASS,
    }
})

const sendMail = (to,subject,html)=>{
    const emailOption = {
        from : process.env.SMTP_FROM,
        to : to,
        subject : subject,
        html : html
    }
    return transporter.sendMail(emailOption);
}

module.exports = sendMail;