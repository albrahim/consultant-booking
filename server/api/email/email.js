const nodemailer = require('nodemailer');
const User = require('../models/user');

const hostField = process.env.MAIL_HOST;
const userField = process.env.MAIL_USER;
const passField = process.env.MAIL_PASS;
const fromField = process.env.MAIL_FROM;

let transporter = nodemailer.createTransport({
    host: hostField,
    port: 587,
    auth: {
        user: userField,
        pass: passField,
    },
    tls: {
        rejectUnauthorized: false
    }
});



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
            const consultantProfile = consultantUser.profile;
            const traineeProfile = traineeUser.profile;
            
            let consultantFullName = (consultantProfile.firstName + ' ' + consultantProfile.lastName);;
            let traineeFullName = (traineeProfile.firstName + ' ' + traineeProfile.lastName);;
            console.log('consultant fullname: ' + consultantFullName);
            console.log('trainee fullname: ' + traineeFullName);

            const timerangeString = `${booking.startTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})} - ${booking.endTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})}, ${booking.startTime.toLocaleDateString('en-uk')}`;
            
            let emailData;
            if (deleteByConsultant) {
                emailData = {
                    from: fromField,
                    to: traineeUser.email,
                    subject: `Your booking with consultant ${consultantFullName} is cancelled`,
                    text: `Your booking with consultant ${consultantFullName} is cancelled (${timerangeString}) by the consultant`,
                    html: `<b>Your booking with consultant ${consultantFullName} is cancelled (${timerangeString}) by the consultant</b>`
                };
            } else {
                emailData = {
                    from: fromField,
                    to: consultantUser.email,
                    subject: `Your session with the trainee ${traineeFullName} is cancelled`,
                    text: `Your session with the trainee ${traineeFullName} is cancelled (${timerangeString}) by the trainee`,
                    html: `<b>Your session with the trainee ${traineeFullName} is cancelled (${timerangeString}) by the trainee</b>`,
                };
            }
            
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

async function sendConsultantBookedMail({booking}) {
    const consultantId = booking.consultant;
    const traineeId = booking.trainee;
    User.findById(consultantId, async function(err, consultantUser) {
        if (err) {
            console.log(err);
            return;
        }
        User.findById(traineeId, async function(err, traineeUser) {
            if (err) {
                console.log(err);
                return;
            }
            const traineeProfile = traineeUser.profile;

            let fullName = null;
            if (traineeProfile) {
                if (traineeProfile.firstName && traineeProfile.lastName) {
                    fullName = (traineeProfile.firstName + ' ' + traineeProfile.lastName);
                }
            }
            console.log('fullname: ' + fullName);
            const traineeWord = fullName ? `The trainee ${fullName}` : 'A trainee';
            const traineeWordLower = fullName ? `the trainee ${fullName}` : 'a trainee';

            const timerangeString = `${booking.startTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})} - ${booking.endTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})}, ${booking.startTime.toLocaleDateString('en-uk')}`;

            const emailData = {
                from: fromField,
                to: consultantUser.email,
                subject: `You have a new session with ${traineeWordLower}`,
                text: `${traineeWord} booked a session with you (${timerangeString})`,
                html: `<b>${traineeWord} booked a session with you (${timerangeString})</b>`
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

async function sendReminderMail({booking}) {
    console.log(`sending reminder for booking: ${booking._id}:`);
    console.log(`Will send reminder mail to consultant ${booking.consultant} and trainee ${booking.trainee}`);

    // find trainee's name and notify the consultant
    User.findById(booking.trainee, async function(err, traineeUser) {
        if (err) {
            console.log(err);
            return;
        }
        const traineeProfile = traineeUser.profile;

        let fullName = null;
        if (traineeProfile && traineeProfile.firstName && traineeProfile.lastName) {
            fullName = (traineeProfile.firstName + ' ' + traineeProfile.lastName);
        }
        const traineeWord = (fullName ? `trainee ${fullName}` : 'a trainee')

        // find consultant's email
        User.findById(booking.consultant, async function(err, consultantUser) {
            if (err) {
                console.log(err);
                return;
            }
            const consultantEmail = consultantUser.email;
            const timerangeString = `${booking.startTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})} - ${booking.endTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})}`;

            const emailData = {
                from: fromField,
                to: consultantEmail,
                subject: `Reminder: You have a session with ${traineeWord}`,
                text: `You have a session with ${traineeWord} in 15 minutes (${timerangeString})`,
                html: `<b>You have a session with ${traineeWord} in 15 minutes (${timerangeString})</b>`
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

    /*
    if (booking.consultant == booking.trainee) {
        return;
    }
    */

    // find consultant's name and notify the trainee
    User.findById(booking.consultant, async function(err, consultantUser) {
        if (err) {
            console.log(err);
            return;
        }
        const consultantProfile = consultantUser.profile;
        let fullName = null;
        if (consultantProfile && consultantProfile.firstName && consultantProfile.lastName) {
            fullName = (consultantProfile.firstName + ' ' + consultantProfile.lastName);
        }
        const consultantWord = (fullName ? `consultant ${fullName}` : 'a consultant')

        // find trainee's email
        User.findById(booking.trainee, async function(err, traineeUser) {
            if (err) {
                console.log(err);
                return;
            }
            const traineeEmail = traineeUser.email;
            const timerangeString = `${booking.startTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})} - ${booking.endTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})}`;

            const emailData = {
                from: fromField,
                to: traineeEmail,
                subject: `Reminder: You have a booking with ${consultantWord}`,
                text: `You have a booking with ${consultantWord} in 15 minutes (${timerangeString})`,
                html: `<b>You have a booking with ${consultantWord} in 15 minutes (${timerangeString})</b>`
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
    sendReminderMail,
}