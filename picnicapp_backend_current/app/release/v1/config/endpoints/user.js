const express = require('express');
const router = express.Router();
const userCtrl = require('../../controllers/users');
const checkAuth = require('../../middleware/check-auth');

//=============================
// Added By Ankur
var cors = require('cors');
//=============================

router.use(express.json());
router.use(express.urlencoded({extended:true}))



router.post('/sign_up', userCtrl.signUp);
router.post('/sign_in', userCtrl.signIn);
router.post('/sign_out', userCtrl.signOut);
router.post('/forgot_password', userCtrl.forgotPassword);
router.post('/reset_password', userCtrl.resetPassword);
router.post('/get_citywise_park_list', userCtrl.getCityParkList);
router.post('/get_park_list', userCtrl.getParkList);
router.post('/get_park_detail', userCtrl.getParkDetail);
router.post('/get_filter_list', userCtrl.getFilter);
router.post('/get_park_list_with_filter',checkAuth, userCtrl.applyFilter);
router.post('/get_cityzipwise_park_list', userCtrl.getCityZipParkList);
router.post('/get_city_list', userCtrl.getCityList);

//----------------------------------------------------------------------
router.post('/get-city-list-for-mob-app', userCtrl.getCityListForMobApp);



router.post('/fetch-park-list', userCtrl.fetchParkList);
//============
// made by Ankur on 14-01-20
router.post('/make-fovourite-park', userCtrl.makeFovouritePark);
router.post('/make-unfovourite-park', userCtrl.makeUnfovouritePark);
router.post('/fetch-fovourite-park-for-user', userCtrl.fetchFovouriteParkforUser);
//============================


router.post('/give_review', userCtrl.giveParkReview);

/*Payment routes*/
router.post('/create_payment', userCtrl.create_payment);



module.exports = router;
