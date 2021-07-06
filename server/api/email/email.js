const nodemailer = require('nodemailer');
const User = require('../models/user');
const Profile = require('../models/profile');

let transporter = nodemailer.createTransport({
    host: "smtp.live.com",
    port: 587,
    auth: {
        user: 'consultant-booking@outlook.com',
        pass: 'giprok-binWe6-wiszid',
    },
    tls: {
        rejectUnauthorized: false
    }
});

let fromField = '"consultant booking" <consultant-booking@outlook.com>';

async function sendSessionCanceledMail({booking, deleteByConsultant}) {
    const consultant = booking.consultant;
    const trainee = booking.trainee;

    User.findById(consultant, async function(err, consultantUser) {
        if (err) {
            console.log(err);
            return;
        }
        User.findById(trainee, async function(err, traineeUser) {
            if (err) {
                console.log(err);
                return;
            }
            Profile.findOne({user: consultant}, async function(err, consultantProfile) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                Profile.findOne({user: trainee}, async function(err, traineeProfile) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    
                    let consultantFullName = null;
                    let traineeFullName = null;
                    if (consultantProfile) {
                        if (consultantProfile.firstName && consultantProfile.lastName) {
                            consultantFullName = (consultantProfile.firstName + ' ' + consultantProfile.lastName);
                        }
                    }
                    if (traineeProfile) {
                        if (traineeProfile.firstName && traineeProfile.lastName) {
                            traineeFullName = (traineeProfile.firstName + ' ' + traineeProfile.lastName);
                        }
                    }
                    console.log('consultant fullname: ' + consultantFullName);
                    console.log('trainee fullname: ' + traineeFullName);

                    const emailData = deleteByConsultant ? {
                        from: fromField,
                        to: traineeUser.email,
                        subject: `Your booking with ${consultantFullName ? `consultant ${consultantFullName}` : 'a consultant'} is cancelled`,
                        text: `Your booking with ${consultantFullName ? `consultant ${consultantFullName}` : 'a consultant'} is cancelled, the one starting from ${booking.startTime} and ending at ${booking.endTime}`,
                        html: `<b>Your booking with ${consultantFullName ? `consultant ${consultantFullName}` : 'a consultant'} is cancelled</b><ul><li>starting: ${booking.startTime}</li><li>ending:${booking.endTime}</li></ul>`
                    } : {
                        from: fromField,
                        to: consultantUser.email,
                        subject: `Your session with ${traineeFullName ? `the trainee ${traineeFullName}` : 'a trainee'} is cancelled`,
                        text: `Your session with ${traineeFullName ? `the trainee ${traineeFullName}` : 'a trainee'} is cancelled, the one starting from ${booking.startTime} and ending at ${booking.endTime}`,
                        html: `<b>Your session with ${traineeFullName ? `the trainee ${traineeFullName}` : 'a trainee'} is cancelled</b><ul><li>starting: ${booking.startTime}</li><li>ending:${booking.endTime}</li></ul>`,
                    };
                    console.log(`Email data: ${JSON.stringify(emailData)}`);
                    try {
                        let info = await transporter.sendMail(emailData);
                        console.log(`Message sent: ${info.messageId}`);
                        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
                    } catch (e) {
                        console.log(`Message Not sent!`);
                        console.log(e);
                        return;
                    }
                });
            });
        });
    });
}

async function sendConsultantBookedMail({booking}) {
    const consultantId = booking.consultant;
    const traineeId = booking.trainee;
    User.findById(consultantId, async function(err, consultantDoc) {
        if (err) {
            console.log(err);
            return;
        }
        Profile.findOne({user: traineeId}, async function(err, traineeProfile) {
            if (err) {
                console.log(err);
                return;
            }
            let fullName = null;
            if (traineeProfile) {
                if (traineeProfile.firstName && traineeProfile.lastName) {
                    fullName = (traineeProfile.firstName + ' ' + traineeProfile.lastName);
                }
            }
            console.log('fullname: ' + fullName);
            const traineeWord = fullName ? `The trainee ${fullName}` : 'A trainee';
            const traineeWordLower = fullName ? `the trainee ${fullName}` : 'a trainee';
            const emailData = {
                from: fromField,
                to: consultantDoc.email,
                subject: `You have a new session with ${traineeWordLower}`,
                text: `${traineeWord} booked a session with you, starting from ${booking.startTime} and ending at ${booking.endTime}`,
                html: `<b>${traineeWord} booked a session with you</b><ul><li>starting: ${booking.startTime}</li><li>ending:${booking.endTime}</li></ul>`
            };
            console.log(`Email data: ${JSON.stringify(emailData)}`);
            try {
                let info = await transporter.sendMail(emailData);
                console.log(`Message sent: ${info.messageId}`);
                console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            } catch (e) {
                console.log(`Message Not sent!`);
                console.log(e);
                return;
            }
        });
    });
}

module.exports = {
    sendConsultantBookedMail,
    sendSessionCanceledMail,
}