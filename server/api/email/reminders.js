const cron = require('node-cron');
const Booking = require('../models/booking');
const email = require('./email');

function start() {
    cron.schedule('*/15 * * * *', runTask);
}

function runTask() {
    const date = new Date();
    date.setSeconds(0, 0);
    const bookingDate = new Date(date);
    bookingDate.setDate(bookingDate.getDate() + 1);
    
    console.log('Current time: ' + JSON.stringify(date));
    Booking.find({
        startTime: {
            $eq: bookingDate,
        }
    }, function(err, result) {
        if (err) {
            console.log('Reminder database error: ' + err)
            return;
        }

        console.log(`Reminders for ${JSON.stringify(bookingDate)}`)
        if (result.length >= 1) {
            console.log('Will send email to: ' + result);
            result.forEach(booking => {
                email.sendReminderMail({
                    booking: booking
                })
                .catch(console.log);
            });
        } else {
            console.log('No new reminders');
        }
        
    });
}

module.exports = {
    start,
}