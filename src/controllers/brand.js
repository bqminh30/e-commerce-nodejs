const Brand = require('../models/brand')
const asyncHandler = require('express-async-handler')

const createBrand = asyncHandler(async(req, res) => {
    const response = await Brand.create(req.body);
    return res.json({
        success: response ? true : false,
        createBrand: response ? response : 'Can\'t create new brand '
    })
})

const getBrands = asyncHandler(async(req, res) => {
    const response = await Brand.find().select('title', '_id');
    return res.json({
        success: response ? true : false,
        brand: response ? response : 'Can\'t get brand '
    })
})

const updateBrand = asyncHandler(async(req, res) => {
    const {bid} = req.params;
    const response = await Brand.findByIdAndUpdate(bid, req.body, {new: true});
    return res.json({
        success: response ? true : false,
        brand: response ? response : 'Can\'t update brand '
    })
})

const deleteBrand = asyncHandler(async(req, res) => {
    const {bid} = req.params;
    const response = await Brand.findByIdAndDelete(bid);
    return res.json({
        success: response ? true : false,
        brand: response ? response : 'Can\'t delete brand '
    })
})

module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand
}