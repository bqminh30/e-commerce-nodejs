const Product = require('../models/product')
const ProductCateGory= require('../models/productCategory')
const asyncHandler = require("express-async-handler");
const data = require('../../data/ecommerce.json')
const categoryData = require('../../data/cate_brand')
const slugify = require("slugify");

const fn = async(product) => {
    // if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name)+ Math.round(Math.random() *100)+' ',
        description: product?.description,
        brand: product?.brand,
        thumb: product?.thumb,
        price: Math.round(Number(product?.price?.match(/\d/g).join(''))/100),
        category: product?.category[0],
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() *100),
        images: product?.images,
        color: product?.variants?.find(el=>el.label === 'Color')?.variants[0],
        totalRatings : Math.round(Math.random() * 5)
    })
}

const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  for(let product of data) promises.push(fn(product))
  await Promise.all(promises)
  return res.json('Done');
});

const fn2 = async(cate) => {
    await ProductCateGory.create({
        title: cate?.cate,
        brand: cate?.brand
    })
}

const insertCategoryProduct = asyncHandler(async (req, res) => {
    const promises = [];
    for(let product of categoryData) promises.push(fn2(product))
    await Promise.all(promises)
    return res.json('Done');
  });

  
module.exports = {
    insertProduct,
    insertCategoryProduct
}