const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Invalid inputs");
  const response = await Blog.create(req.body);
  return res.json({
    success: response ? true : false,
    createBlog: response ? response : "Can't create new blog ",
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
  return res.json({
    success: response ? true : false,
    updateBlog: response ? response : "Can't update blog ",
  });
});

const getBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.json({
    success: response ? true : false,
    blogs: response ? response : "Can't get blog ",
  });
});

// LIKE|| DISLIKE
const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");
  const blog = await Blog.findById(bid);
  const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { dislikes: _id },
        // isDisliked: false,
      },
      {
        new: true,
      }
    );
    return res.json({
      success: response ? true : false,
      res: response,
    });
  }

  const isLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { likes: _id },
        // isLiked: false,
      },
      {
        new: true,
      }
    );
    return res.json({
      success: response ? true : false,
      res: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $push: { likes: _id },
        // isLiked: true,
      },
      {
        new: true,
      }
    );
    return res.json({
      success: response ? true : false,
      res: response,
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");
  const blog = await Blog.findById(bid);
  const alreadyLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (alreadyLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { likes: _id },
        // isDisliked: false,
      },
      {
        new: true,
      }
    );
    return res.json({
      success: response ? true : false,
      res: response,
    });
  }

  const isDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (isDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { dislikes: _id },
        // isLiked: false,
      },
      {
        new: true,
      }
    );
    return res.json({
      success: response ? true : false,
      res: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $push: { dislikes: _id },
        // isLiked: true,
      },
      {
        new: true,
      }
    );
    return res.json({
      success: response ? true : false,
      res: response,
    });
  }
});

const excludeFields = "-refreshToken -password -role -createdAt -updatedAt";
const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    bid,
    {
      $inc: { numberViews: 1 },
    },
    { new: true }
  )
    .populate("likes", excludeFields)
    .populate("dislikes", excludeFields);
  return res.json({
    success: blog ? true : false,
    res: blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndDelete(bid);
  return res.json({
    success: blog ? true : false,
  });
});

const updateImageBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  console.log('req', req.file)
  if (!req.file) throw new Error("Missing files");
  const response = await Blog.findByIdAndUpdate(
    bid,
    {
      image: req.file.path,
    },
    {
      new: true,
    }
  );

  return res.status(200).json({
    status: response ? true : false,
    blog: response ? response : "Cannot update image blog",
  });
});

module.exports = {
  createBlog,
  updateBlog,
  getBlogs,
  likeBlog,
  dislikeBlog,
  getBlog,
  deleteBlog,
  updateImageBlog,
};
