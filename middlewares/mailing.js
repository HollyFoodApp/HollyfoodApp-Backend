import nodemailer from "nodemailer";

const sendEmail = async (email, subject, message, code) => {

    try {
        const transporter = nodemailer.createTransport({
            pool: true,
            host: "smtp.gmail.com",
            port: 587,
            auth: {
            user: "khairi.slimani@esprit.tn", 
            pass: "nKESPwb7531"
            },
        });

        await transporter.sendMail({
        from:  process.env.USER,
        to: email,
        subject: subject,
        text: message+code,
        });
    
        console.log("Email Sent Successfully");

    }catch(error) {
        console.log("Email Not Sent");
        console.log(error);
    }

};

export default sendEmail;
