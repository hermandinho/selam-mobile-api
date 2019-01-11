const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const townSchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: false },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
    live: { type: Boolean, default: true },
});

townSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Town', townSchema);
