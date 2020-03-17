const express = require('express');
const router = express.Router();
const cityAdminCtrl = require('../../controllers/city-admin');
const checkAuth = require('../../middleware/check-auth');
router.use(express.json());
router.use(express.urlencoded({extended:true}))




// router.post('/add_edit_amenity',checkAuth, cityAdminCtrl.addeditamenity);
// router.post('/add_edit_details',checkAuth, cityAdminCtrl.addeditdetails);
router.post('/find_park', cityAdminCtrl.findParkByCity);
router.post('/find_contests', cityAdminCtrl.findContestsByCity);
router.post('/find_contest', cityAdminCtrl.findContestByID);
router.post('/add_edit_park', cityAdminCtrl.addEditPark);
router.post('/add_edit_contest', cityAdminCtrl.addEditContest);
router.post('/remove_park', cityAdminCtrl.removePark);
router.post('/remove_contest', cityAdminCtrl.removeContest);
router.post('/add_edit_pavillions',checkAuth, cityAdminCtrl.addEditPavillions);
router.post('/add_edit_field',checkAuth, cityAdminCtrl.addEditField);

router.post('/change_pavillion_status',checkAuth, cityAdminCtrl.changeReservableStatus);
router.post('/reply_to_review',checkAuth, cityAdminCtrl.replyReview);

router.post('/add_review_for_park', cityAdminCtrl.addReviewForPark);
router.post('/get_park_reviews', cityAdminCtrl.getParkReviews);
router.post('/get_park_reviews_for_user', cityAdminCtrl.getParkReviewsForUser);

module.exports = router;