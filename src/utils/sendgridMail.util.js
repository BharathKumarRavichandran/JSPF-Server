const sgMail = require('@sendgrid/mail');

// Importing configuration/env variables
const config = require('../config/config');

exports.sendVerificationCode = async (recipientEmail,verificationCode) => {
    try {
        const message = {
            from: config.email.SITE_NOREPLY_EMAIL,
            to: recipientEmail,
            subject: 'Jitheshraj Scholarship Email Verification Code',
            html: `
                <div>
                    <div>Hi !</div>
                    <br/>
                    <div>Welcome to Jitheshraj Scholarship - ​An initiative of the academy for holistic education, awareness and development(AHEAD) Trust. In order to apply on the portal we require you to verify your account so enter the code given below into the verification box on the website.</div>
                    <br/>
                    <div><strong>Verification code: ${verificationCode}</strong></div>
                    <br/>
                    <div>Email info@jrscholarship.org if you have any questions.</div>
                    <br/>
                    <div>Regards,</div>
                    <div>Team JSPF</div>
                </div>
            `,
        };
        let mail = await sgMail.send(message);
        return {
            status_code: 200,
            message: `Success`
        }
    } catch(error){
        return {
            status_code: 400,
            message: error.toString()
        }
    }
}