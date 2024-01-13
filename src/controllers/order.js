const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {coupon} = req.body;
  const userCart = await User.findById(_id).select("cart").
  populate('cart.product', 'title price');
  const products = userCart?.cart?.map(el=> ({
    product: el.product._id,
    count: el.quantity,
    color: el.color
  }))
  let total = userCart?.cart?.reduce((sum, el)=> el.product.price*el.quantity + sum, 0)
  const createdData = {
    products,
    total,
    orderBy: _id
  }
  if(coupon){
    const selectedCoupon = await Coupon.findById(coupon)
    total = Math.round(total * (1- +selectedCoupon.discount/100)/ 1000) *1000 || total
    createdData.total = total
    createdData.coupon = coupon
  }
  const rs = await Order.create(createdData)
  return res.json({
    success: rs ? true : false,
    rs: rs ? rs : "Can't create new order ",
  });
});

const updateStatus = asyncHandler(async(req, res, next)=> {
  const {oid} = req.params;
  const {status} = req.body;
  if(!status) throw new Error('Missing status')
  const response = await Order.findByIdAndUpdate(oid, {status}, {new: true})
  return res.json({
    success: response ? true : false,
    response: response ? response : "Can't update order ",
  });
})

const getUserOrder = asyncHandler(async(req, res, next)=> {
  const {_id} = req.user;
  const response = await Order.find({orderBy: _id})
  return res.json({
    success: response ? true : false,
    response: response ? response : "Can't update order ",
  });
})

const getOrders = asyncHandler(async(req, res, next)=> {
  const response = await Order.find()
  return res.json({
    success: response ? true : false,
    response: response ? response : "Can't update order ",
  });
})


module.exports = {
  createOrder,
  updateStatus,
  getUserOrder,
  getOrders
};
