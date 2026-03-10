
import nodemailer from 'nodemailer';
import 'dotenv/config';

export default async function MailSender({ email, title, body }) {

    try {
        
        const transport = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            port : 465,
            secure : true,
            service : 'gmail',
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }
        });

        const info = await transport.MailMessage({
            from : `"How To Assemble Anything" <${process.env.MAIL_HOST}>`,
            to : email,
            subject : title,
            html : body
        });

        console.log('Email Send Successfully ',info.massageId);

        return info;

    } catch (error) {
        throw new Error('Error while Sending Mail - ', error);
    }
    
}