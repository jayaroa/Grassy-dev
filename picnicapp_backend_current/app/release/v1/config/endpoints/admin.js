const express = require('express');
const router = express.Router();
const adminCtrl = require('../../controllers/admin');
const checkAuth = require('../../middleware/check-auth');
router.use(express.json());
router.use(express.urlencoded({extended:true}))

router.post('/get_city_admins', adminCtrl.getCityAdminList);
router.post('/approve_city_admin', adminCtrl.approveCityAdmin);

router.post('/get_amenity_list', adminCtrl.getAllAmenity);
router.post('/add_edit_amenity', adminCtrl.addEditAmenity);
router.post('/remove_amenity', adminCtrl.removeAmenity);

router.post('/get_details_list', adminCtrl.getAllGlobalDetails);
router.post('/add_edit_details', adminCtrl.addEditDetails);
router.post('/remove_details', adminCtrl.removeDetails);

router.post('/get_pavilion_details_list', adminCtrl.getAllPavilionDetails);
router.post('/add_edit_pavilion_details', adminCtrl.addEditPavilionDetails);
router.post('/remove_pavilion_details', adminCtrl.removePavilionDetails);

router.post('/get_city_list', adminCtrl.getAllCities);
router.post('/get_city_state', adminCtrl.getCityState);
router.post('/add_edit_city', adminCtrl.addEditCity);
router.post('/remove_city', adminCtrl.removeCity);

router.post('/find_park', adminCtrl.findPark);
router.post('/find_park_details', adminCtrl.getSingleParkDetails);
router.post('/approve_park', adminCtrl.approvePark);
router.post('/add_edit_park', adminCtrl.addEditPark);
router.post('/remove_park', adminCtrl.removePark);

module.exports = router;
