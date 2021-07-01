const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3003;
console.log('Port: ' + port);

/*
const nodemailer = require('nodemailer');
async function main() {
    console.log("will create transport");
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: 'lloyd75@ethereal.email',
            pass: 'BbcPe8t2wx3hqZanTW',
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    console.log('will send mail')
    let info = await transporter.sendMail({
        from: '"Lloyd Stanton" <lloyd75@ethereal.email>',
        to: "bar@example.com, baz@example.com",
        subject: "Hello",
        text: "Hello World?",
        html: "<b>Hello World?</b>"
    });

    console.log(`Message sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}
main().catch(console.error);
*/

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Website is running at http://localhost:${port}`);
});

/*const app = require('./app');
const port = 3003;
app.listen(port, () => {
    console.log(`Website is running at http://localhost:${port}`);
});*/