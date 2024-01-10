const ProductCategory = require('../models/productCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async(req, res) => {
    const response = await ProductCategory.create(req.body);
    return res.json({
        success: response ? true : false,
        createCategory: response ? response : 'Can\'t create new category '
    })
})

const getCategories = asyncHandler(async(req, res) => {
    const response = await ProductCategory.find().select('title', '_id');
    return res.json({
        success: response ? true : false,
        prodCate: response ? response : 'Can\'t get category '
    })
})

const updateCategories = asyncHandler(async(req, res) => {
    const {pcid} = req.params;
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {new: true});
    return res.json({
        success: response ? true : false,
        prodCate: response ? response : 'Can\'t update new category '
    })
})

const deleteCategories = asyncHandler(async(req, res) => {
    const {pcid} = req.params;
    const response = await ProductCategory.findByIdAndDelete(pcid);
    return res.json({
        success: response ? true : false,
        prodCate: response ? response : 'Can\'t delete new category '
    })
})

module.exports = {
    createCategory,
    getCategories,
    updateCategories,
    deleteCategories
}