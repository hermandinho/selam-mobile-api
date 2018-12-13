const Country = require('../models/country');
const Town = require('../models/town');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');

exports.filters = async (req, res, next) => {
  const countries = await Country.find().select('name currency').exec();
  const towns = await Town.find().select('name country').populate('country', '_id name').exec();
  const categories = await Category.find().select('name').exec();
  const subCategories = await SubCategory.find().select('name').populate('category', '_id name').exec();

  res.status(200).json({countries, towns, categories, subCategories});
};
