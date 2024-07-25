const express = require('express')
const nodemailer = require('nodemailer');
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: 587,
    // secure: false, // Use `true` for port 465, `false` for all other ports
    // requireTLS: true,

    service: 'gmail',
    // host: "smtp.ethereal.email",
    port: 25, // 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/blabla', (req, res) => {
    res.send('YO!')
})

app.post('/sendMessage', (req, res) => {
// async..await is not allowed in global scope, must use a wrapper
    const {message, email, name} = req.body;

    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'Kirill test', // sender address
            to: process.env.RECEIVER_EMAIL, // list of receivers
            subject: "Hello ✔", // Subject line
            // text: "Hello world?", // plain text body
            html: `
<div><b>Hi! Data from form:</b></div>
<div>Email: ${email}</div>
<div>Name: ${name}</div>
<div>Message: ${message}</div>
`, // html body
        });
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }

    main().catch(console.error);

    res.send('Message sent!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


