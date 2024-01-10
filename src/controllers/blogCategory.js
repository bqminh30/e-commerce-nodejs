const BlogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async(req, res) => {
    const response = await BlogCategory.create(req.body);
    return res.json({
        success: response ? true : false,
        createCategory: response ? response : 'Can\'t create new category '
    })
})

const getCategories = asyncHandler(async(req, res) => {
    const response = await BlogCategory.find().select('title', '_id');
    return res.json({
        success: response ? true : false,
        prodCate: response ? response : 'Can\'t get category '
    })
})

const updateCategories = asyncHandler(async(req, res) => {
    const {pcid} = req.params;
    const response = await BlogCategory.findByIdAndUpdate(pcid, req.body, {new: true});
    return res.json({
        success: response ? true : false,
        prodCate: response ? response : 'Can\'t update new category '
    })
})

const deleteCategories = asyncHandler(async(req, res) => {
    const {pcid} = req.params;
    const response = await BlogCategory.findByIdAndDelete(pcid);
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