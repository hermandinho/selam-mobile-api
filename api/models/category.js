const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: false },
    slug: { type: String, required: false },
    webIcon: { type: String, required: false },
    mobileIcon: { type: String, required: false },
    live: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
categorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Category', categorySchema);
