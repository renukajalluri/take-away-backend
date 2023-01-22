const nodemailer = require('nodemailer');
const sendEmail =async (email,otp) =>{
    try{
        const output = `
        <p>One Time Password for take away registration is <h2>${otp}</h2> </p>
        `;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "dpspakurweb@gmail.com",
                pass: "xsgshqrfgyghznio",
            },
        });
        const mailOptions = {
            from: '"Take Away" <dpspakurweb@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "otp", // Subject line
            html: output, // html body
        };
        const res = await transporter.sendMail(mailOptions)
        return res
    }catch(e){
        return e
    }
           
}

module.exports = {sendEmail}