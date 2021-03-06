const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: false },
    category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Category" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
