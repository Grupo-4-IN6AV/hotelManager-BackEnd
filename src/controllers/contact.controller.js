'use strict'

//Constantes para Contactanos
const nodeMailer = require('nodemailer')
const { google, Auth } = require('googleapis')

exports.sendMessage = async (req, res) => {
    try {
        const params = req.body;
        let contentHTML = `
            <h1>Hotel Manager</h1>
            <h3>User Information</h3>
            <ul>
                <li>Name: ${params.username} </li>
                <li>Email: ${params.email} </li>
                <li>Phone: ${params.phone} </li>
            </ul>
            <h3>Message</h3>
            <p>Message: ${params.message}</P>
        `;

        const CLIENTID = "1037963197907-0gvhoh950i741hg8rcard6t0gqib72uu.apps.googleusercontent.com";
        const CLIENT_SECRET = "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";
        const REDIRECT_URI = "https://developers.google.com/oauthplayground";
        const REFRESH_TOKEN = "1//04MTSc3qe4k1xCgYIARAAGAQSNwF-L9Irny5K7MyAN3plPMwd3Y5tFFUoTo0Sx1Wgb2Icenx8R9xsczNEMHTrkLY72j31v3t6tjA";

        const oAuth2Client = new google.auth.OAuth2(CLIENTID, CLIENT_SECRET, REDIRECT_URI);

        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        async function sendMail() {
            try {
                const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
                const transporte = nodeMailer.createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user: "hotelmanagerdb@gmail.com",
                        clientId: CLIENTID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: ACCESS_TOKEN
                    }
                });
                const mailOptions = {
                    from: "Hotel Manager <hotelmanagerdb@gmail.com>",
                    to: "hotelmanagerdb@gmail.com",
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