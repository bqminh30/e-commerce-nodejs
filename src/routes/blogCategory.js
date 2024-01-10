const router = require('express').Router()
const ctrls = require('../controllers/blogCategory')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')



router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory)
router.get('/', ctrls.getCategories)

router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateCategories)
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteCategories)
// router.get('/:pid', ctrls.getProduct)


module.exports = router