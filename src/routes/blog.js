const router = require("express").Router();
const ctrls = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createBlog);
router.get("/", ctrls.getBlogs);
router.get("/one/:bid", ctrls.getBlog);
router.put("/like/:bid", [verifyAccessToken], ctrls.likeBlog);
router.put("/dislike/:bid", [verifyAccessToken], ctrls.dislikeBlog);


router.put("/:bid", [verifyAccessToken, isAdmin], ctrls.updateBlog);
router.put(
    "/uploadimage/:bid",
    [verifyAccessToken, isAdmin],
    uploader.single("image"),
    ctrls.updateImageBlog
  );
router.delete("/:bid", [verifyAccessToken, isAdmin], ctrls.deleteBlog);
// router.get('/:pid', ctrls.getProduct)

module.exports = router;
