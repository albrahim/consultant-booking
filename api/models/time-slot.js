const mongoose = require('mongoose');

const timeSlotSchema = mongoose.Schema({
    start: Date,
    end: Date
});
const timeSlotModel = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = {
    schema: timeSlotSchema,
    model: timeSlotModel,
}