import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporterEmail =()=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rizsid16@gmail.com',
          pass: 'oflb iihf ttvw peht'
        }
    });
    return transporter;
};

const getMailOptions =(email, verificationCode)=> ({
    from: 'rizsid16@gmail.com',
    to: email,
    subject: 'Account Verification',
    text: `Your verification code is: ${verificationCode}`
});

const getRandomCode =()=> crypto.randomBytes(3).toString('hex');

export { getRandomCode, transporterEmail, getMailOptions };