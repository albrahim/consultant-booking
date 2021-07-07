const nodemailer = require('nodemailer');
const User = require('../models/user');
const Profile = require('../models/profile');

const debug = true;
const hostField = debug ? "smtp.ethereal.email" : "smtp.live.com";
const userField = debug ? 'joelle.lueilwitz@ethereal.email' : 'consultant-booking@outlook.com';
const passField = debug ? 'AQeQxRERJ1Mt9cCxG3' : 'giprok-binWe6-wiszid';

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

let fromField = debug ?
    '"Joelle Lueilwitz" <joelle.lueilwitz@ethereal.email>':
    '"consultant booking" <consultant-booking@outlook.com>';

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

                    const timerangeString = `${booking.startTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})} - ${booking.endTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})}, ${booking.startTime.toLocaleDateString('en-uk')}`;
                    
                    const emailData = deleteByConsultant ? {
                        from: fromField,
                        to: traineeUser.email,
                        subject: `Your booking with ${consultantFullName ? `consultant ${consultantFullName}` : 'a consultant'} is cancelled`,
                        text: `Your booking with ${consultantFullName ? `consultant ${consultantFullName}` : 'a consultant'} was cancelled (${timerangeString}) by the consultant`,
                        html: `<b>Your booking with ${consultantFullName ? `consultant ${consultantFullName}` : 'a consultant'} was cancelled (${timerangeString}) by the consultant</b>`
                    } : {
                        from: fromField,
                        to: consultantUser.email,
                        subject: `Your session with ${traineeFullName ? `the trainee ${traineeFullName}` : 'a trainee'} is cancelled`,
                        text: `Your session with ${traineeFullName ? `the trainee ${traineeFullName}` : 'a trainee'} was cancelled (${timerangeString}) by the trainee`,
                        html: `<b>Your session with ${traineeFullName ? `the trainee ${traineeFullName}` : 'a trainee'} was cancelled (${timerangeString}) by the trainee</b>`,
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

            const timerangeString = `${booking.startTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})} - ${booking.endTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})}, ${booking.startTime.toLocaleDateString('en-uk')}`;

            const emailData = {
                from: fromField,
                to: consultantDoc.email,
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
    Profile.findOne({ user: booking.trainee }, async function(err, doc) {
        if (err) {
            console.log(err);
            return;
        }
        let fullName = null;
        if (doc && doc.firstName && doc.lastName) {
            fullName = (doc.firstName + ' ' + doc.lastName);
        }
        const traineeWord = (fullName ? `trainee ${fullName}` : 'a trainee')

        // find consultant's email
        User.findById(booking.consultant, async function(err, doc) {
            if (err) {
                console.log(err);
                return;
            }
            const traineeEmail = doc.email;
            const timerangeString = `${booking.startTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})} - ${booking.endTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})}`;

            const emailData = {
                from: fromField,
                to: traineeEmail,
                subject: `You have a session with ${traineeWord} tomorrow`,
                text: `You have a session with ${traineeWord} (${timerangeString})`,
                html: `<b>You have a session with ${traineeWord} tomorrow (${timerangeString})</b>`
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
    Profile.findOne({ user: booking.consultant }, async function(err, doc) {
        if (err) {
            console.log(err);
            return;
        }
        let fullName = null;
        if (doc && doc.firstName && doc.lastName) {
            fullName = (doc.firstName + ' ' + doc.lastName);
        }
        const consultantWord = (fullName ? `consultant ${fullName}` : 'a consultant')

        // find trainee's email
        User.findById(booking.trainee, async function(err, doc) {
            if (err) {
                console.log(err);
                return;
            }
            const traineeEmail = doc.email;
            const timerangeString = `${booking.startTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})} - ${booking.endTime.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})}`;

            const emailData = {
                from: fromField,
                to: traineeEmail,
                subject: `You have a booking with ${consultantWord} tomorrow`,
                text: `You have a booking with ${consultantWord} tomorrow (${timerangeString})`,
                html: `<b>You have a booking with ${consultantWord} tomorrow (${timerangeString})</b>`
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