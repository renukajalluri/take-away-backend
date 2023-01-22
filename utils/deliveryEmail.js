const nodemailer = require('nodemailer');
const deliveryEmail =async (email) =>{
    try{
        const output = `
        <p>your order has been delivered </p>
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
            subject: "Delivery update", // Subject line
            html: output, // html body
        };
        const res = await transporter.sendMail(mailOptions)
        return res
    }catch(e){
        return e
    }
           
}

module.exports = {deliveryEmail}