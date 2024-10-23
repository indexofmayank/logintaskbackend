const router = require('express').Router();
const userController = require('../controllers/UserController');

router.route('/').post(userController.createUser);
router.route('/login/').post(userController.loginUser);
router.route('/user-verification/:id').get(userController.verifyUserOtp);
router.route('/auth-user/:id').get(userController.createAuthUser);
router.route('/:id').get(userController.getUserById);
router.route('/forgetpassword').post(userController.resetUserPassword);
router.route('/verifyforgetpassword').post(userController.verifyForgetPasswordOtp);
router.route('/updatepassword').post(userController.updateUserPassword);

module.exports = router;