const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');

// Importing configuration/env variables
const config = require('../config/config');

// Setting Sendgrid API key
sgMail.setApiKey(config.key.SENDGRID_API_KEY);

exports.sendVerificationCode = async (recipientEmail,verificationCode) => {
    try {
        const message = {
            from: config.email.SITE_NOREPLY_EMAIL,
            to: recipientEmail,
            subject: 'Jitheshraj Scholarship Email Verification Code',
            html: `
                <div>
                    <div>Hi,</div>
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

exports.sendPasswordVerificationCode = async (recipientEmail,verificationCode) => {
    try {
        const message = {
            from: config.email.SITE_NOREPLY_EMAIL,
            to: recipientEmail,
            subject: 'Jitheshraj Scholarship Password Reset Verification Code',
            html: `
                <div>
                    <div>Hi,</div>
                    <br/>
                    <div>You have requested for a password reset.</div>
                    <br/>
                    <div><strong>If this was you:</strong></div>
                    <div>Great! There's nothing else you need to do.</div>
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

exports.sendApplicationSummary = async (recipientEmail,applicationSummaryPath) => {
    try {
        let message = {
            from: config.email.SITE_NOREPLY_EMAIL,
            to: recipientEmail,
            subject: 'Jitheshraj Scholarship Application Summary',
            html: `
                <div>
                    <div>Hi,</div>
                    <br/>
                    <div>Successfully received your application form for Jitheshraj Scholarship ${config.date.START_YEAR}-${config.date.END_YEAR}.</div>
                    <br/>
                    <div>A summary of your application is attached with the mail for your future reference.</div>
                    <br/>
                    <div>Email info@jrscholarship.org if you have any queries.</div>
                    <br/>
                    <div>Regards,</div>
                    <div>Team JSPF</div>
                </div>
            `,
            attachments: [
                {
                    content: fs.readFileSync(applicationSummaryPath,{ encoding: "base64" }),
                    filename: 'JSPF-Application'+path.extname(applicationSummaryPath),
                    type: `${config.files.archive.mimeType}`,
                    disposition: 'attachment',
                    contentId: 'JSPF-Application'
                },
            ],
        };
        let mail = await sgMail.send(message);

        return {
            status_code: 200,
            message: `Success`
        }
    } catch(error){
        console.log('mailerror',error);
        return {
            status_code: 400,
            message: error.toString()
        }
    }
}
