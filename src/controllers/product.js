const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new product",
  });
});
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid).populate({
    path: 'ratings',
    populate: {
      path: 'postedBy',
      select: 'lastname firstname avatar'
    }
  });
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get product",
  });
});
// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  //Tach cac truong dac biet ra khoi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((field) => delete queries[field]);

  //Format lai cac operators cho dung cu phap mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (macthedEl) => `$${macthedEl}`);
  const formatedQueries = JSON.parse(queryString);
  let colorQueryObject = {}
  //Filtering
  if (queries.title) {
    formatedQueries.title = { $regex: new RegExp(queries.title, "i") };
  } 
  if (queries.category) {
    formatedQueries.category = { $regex: new RegExp(queries.category, "i") };
  } 
  if (queries.color) {
    delete formatedQueries.color;
    const colorArr = queries.color.split(',');
    const colorQuery = colorArr.map(el => (
      {color: {$regex: el, $options: 'i'}}
    ))
    colorQueryObject = {$or: colorQuery}
  } 
  const q = {...colorQueryObject,...formatedQueries}
  let queryCommand = Product.find(q);
  //Sorting
  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    queryCommand = queryCommand.sort(sortBy);
  }

  //Fields limiting
  if(req.query.fields){
    const fields = req.query.fields.split(',').join(' ');
    queryCommand = queryCommand.select(fields);
  }

  //Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page -1 ) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  
  let resData = await queryCommand
  const counts = await Product.countDocuments(q);

  return res.status(200).json({
    success: resData ? true : false,
    productDatas: queryCommand ? resData : "Cannot get products",
    counts,
  });
});


const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct ? updatedProduct : "Cannot update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    deletedProduct: deletedProduct ? deletedProduct : "Cannot delete product",
  });
});

const ratings = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    const {star, comment, pid, updatedAt} = req.body;
    if(!star || !pid) throw new Error("Missing inputs")
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(el=> el.postedBy.toString() === _id)
    if(alreadyRating){
        // update star and comment
        await Product.updateOne({
            // elemMatch === find trong js
            ratings : {$elemMatch: alreadyRating}
        }, {
            $set : {
                "ratings.$.star" : star,
                "ratings.$.comment" : comment,
                "ratings.$.updatedAt" : updatedAt,

            }
        },{new: true})
    }else {
        // add star and comment
        const respone = await Product.findByIdAndUpdate(pid, {
            $push : {ratings: {star, comment, postedBy: _id}}
        }, {new: true})
    }

    //Sum ratings 
    const totalRating = ratingProduct?.ratings?.reduce((acc,val) => {
        return acc+val.star
    },0)

    const updatePrd = await Product.findByIdAndUpdate(pid, {
        totalRatings: (totalRating/ratingProduct?.ratings.length).toFixed(2)
    })


    return res.status(200).json({
        status: true,
        data: updatePrd
    })
})


const updateImagesProduct = asyncHandler(async(req, res) => {
  const {pid} = req.params;
  if(!req.files) throw new Error('Missing files')
  const response = await Product.findByIdAndUpdate(pid, {
    $push: {
      images: {
        $each : req.files.map(el=> el.path)
      }
    }
  }, {
    new: true
  })

  return res.status(200).json({
    status: response ? true: false,
    product: response ? response : 'Cannot update images product'
  })
})


module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  updateImagesProduct
};
