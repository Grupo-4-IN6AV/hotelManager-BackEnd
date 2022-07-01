'use strict'

//Constantes para Contactanos
const nodeMailer = require('nodemailer')
const { google, Auth } = require('googleapis')

exports.sendMessage = async (req, res) => {
    try {
        const params = req.body;
        let contentHTML = `
            <h1>User Information</h1>
            <ul>
                <li>Name: ${params.username} </li>
                <li>Email: ${params.email} </li>
                <li>Phone: ${params.phone} </li>
            </ul>
            <h1>Message</h1>
            <p>Message: ${params.message}</P>
        `;

        const CLIENTID = "546188062863-vgrpmo26hpifrmpto1bualpic11rtcm8.apps.googleusercontent.com";
        const CLIENT_SECRET = "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";
        const REDIRECT_URI = "https://developers.google.com/oauthplayground";
        const REFRESH_TOKEN = "1//04FjufUsCiLdGCgYIARAAGAQSNwF-L9IrUUFTAF1cpLnz02S1fmf_UlxPAC7Cn8jxb7OxWeFTeQ1SOw5AyX2pt_wfuk68IHaYw_k";

        const oAuth2Client = new google.auth.OAuth2(CLIENTID, CLIENT_SECRET, REDIRECT_URI);

        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        async function sendMail() {
            try {
                const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
                const transporte = nodeMailer.createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user: "hotelsmanagertechnicalservice@gmail.com",
                        clientId: CLIENTID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: ACCESS_TOKEN
                    }
                });
                const mailOptions = {
                    from: "Hotel Manager <hotelsmanagertechnicalservice@gmail.com>",
                    to: "hotelsmanagertechnicalservice@gmail.com",
                    subject: "Contact Us Message",
                    html: contentHTML
                };

                const result = await transporte.sendMail(mailOptions);
                return result;
            } catch (err) {
                console.log(err)
            }
        }

        sendMail()
            .then((result) => {
                return res.send({ message: 'Message sended successfully' });
            })
            .catch((err) => {
                return res.status(400).send({ message: 'Error = ' + err.message });
            })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error sending message '});
    }
}