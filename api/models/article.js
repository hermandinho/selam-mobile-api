const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const articleSchema = mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: false },
    description: { type: String, default: 'Pas disponible.' },
    price: {
        amount: { type: Number, required: true, default: 0 },
        fixed: { type: Boolean, default: false }
    },
    currency: { type: String, default: 'CFA' },
    pictures: [{type: String}],
    region: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Town" },
    //displayPhoneNumber: { type: Boolean, default: true },
    //displayEmail: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    subCategory: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SubCategory' },
    published: { type: Boolean, default: false },
    available: { type: Boolean, default: true }, // Sold or not
    live: { type: Boolean, default: true },
    exchange: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

articleSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Article', articleSchema);
