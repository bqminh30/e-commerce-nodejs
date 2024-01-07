const router = require('express').Router()
const ctrls = require('../controllers/user')
// const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/register', ctrls.register)

module.exports = router