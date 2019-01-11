const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const contactSchema = mongoose.Schema({
    email: { type: String, required: false },
    title: { type: String, required: true },
    description: { type: String, required: true},
    live: { type: Boolean, default: true },
    picture: {type: String},
    date: {type: Date, default: Date.now}
});
contactSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Contact', contactSchema);