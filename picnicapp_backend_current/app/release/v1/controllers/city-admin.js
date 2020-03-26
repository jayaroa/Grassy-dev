const mongoose = require("mongoose");
const User = require("../models/user");
const Amenity = require("../models/amenity");
const Park = require("../models/park");
const Contest = require("../models/contest");
const Review = require("../models/review");
const Pavillion = require("../models/pavillion");
const Field = require("../models/field");
// const imageUpload = require("../../../services/ImageUploadBase64");
const Mailercontroller = require("../../../services/mailer");
const errorMsgJSON = require("../../../services/errors.json");
const AutogenerateIdcontroller = require('../../../services/AutogenerateId');
var isodate = require("isodate");


module.exports = {

  getParkReviews: (req, res, next) => {
    try {
      let lang = req.headers.language ? req.headers.language : "EN";

      // Here, we are receiving the Park Id
      let parkId = req.body.park_id ? req.body.park_id : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - Park Id",
      });

      // Here, Circular json avoided
      if (!req.body.park_id) { return; }

      let aggrQuery = [
        {
          $match: {
            'parkId': parkId,
          }
        }];

      Review.aggregate(aggrQuery, function (err, response) {
        if (err) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 404,
            details: null
          })

          return;
        }

        if (response) {

          if (response.length == 0) {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["1033"],
              statuscode: 1033,
              details: null
            })

            return;
          }

          if (response.length > 0) {
            res.json({
              isError: false,
              message: errorMsgJSON[lang]["200"],
              statuscode: 200,
              reviews: response
            })

            return;
          }

        }

      });

    } catch (e) {
      res.send(e);
    }

  },

  getParkReviewsForUser: (req, res, next) => {
    try {
      console.log(' I AM HERE');
      let lang = req.headers.language ? req.headers.language : "EN";

      // Here, we are receiving the Park Id
      let parkCity = req.body.park_city ? req.body.park_city : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - park_city",
      });

      let userId = req.body.user_id ? req.body.user_id : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - user_id",
      });

      /*Code changed by Sheeza*/
      // Need to add this date range into the query TODO
      let startDate = req.body.start_date ? req.body.start_date : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - start_date",
      });

      let endDate = req.body.end_date ? req.body.end_date : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - end_date",
      });
      //Uncomment to test the variable
      // console.log('start date', new Date(startDate).toISOString());
      // console.log('end date',  new Date(endDate).toISOString());
      // console.log('start date', startDate);
      // console.log('end date',  endDate);
      // Here, Circular json avoided
      //if (!req.body.park_id) { return; }


      /*Query changed by Sheeza*/
      let aggrQuery = [
        {
          $match: {
            'cityState': parkCity,
            'userId': userId,
            'createdAt': {
              $gte: isodate(new Date(startDate).toISOString()),
              $lte: isodate(new Date(endDate).toISOString())
            }
          }
        }];

      //          Review.count({date: {
      //                $gte: startDate,
      //                $lt: endDate
      //            }}, function( err, count){
      //                res.json({
      //                    message: count
      //                  })
      //            });
      // TODO need to make this distinct on parkId
      Review.aggregate(aggrQuery, function (err, response) {
        if (err) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 404,
            details: null
          })

          return;
        }

        if (response) {

          if (response.length == 0) {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["1033"],
              statuscode: 1033,
              details: null
            })

            return;
          }

          if (response.length > 0) {
            res.json({
              isError: false,
              message: errorMsgJSON[lang]["200"],
              statuscode: 200,
              reviews: response
            })

            return;
          }

        }

      });

    } catch (e) {
      console.log('i am here in error', e);
      res.send(e);
    }

  },

  // This function is used to add the review for a particular park
  addReviewForPark: (req, res, next) => {

    try {
      let lang = req.headers.language ? req.headers.language : "EN";

      // Here, we are receiving the Park Id
      let parkId = req.body.park_id ? req.body.park_id : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - Park Id",
      });

      // Here, we are receiving the Reviewer name
      let reviewerName = req.body.reviewer_name ? req.body.reviewer_name : "Anonymous";

      // Here, we are receiving the User Id
      let userId = req.body.user_id ? req.body.user_id : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - User Id",
      });

      // Here, we are receiving the rating of the Park
      let rating = req.body.rating_value ? req.body.rating_value : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - Rating",
      });

      // Here, we are receiving the review of the park
      let message = req.body.review_text ? req.body.review_text : "N/A";

      // Here, we are receiving the cars of the park
      let cars = req.body.cars ? req.body.cars : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - Cars",
      });

      // Here, we are receiving the people of the park
      let people = req.body.people ? req.body.people : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - People",
      });

      // Here, we are receiving the city_state of the park
      let cityState = req.body.city_state ? req.body.city_state : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - city_state",
      });

      // Here, we are receiving the city_state of the park
      let newParkRating = req.body.new_park_rating ? req.body.new_park_rating : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - new_park_rating",
      });

      // Here, we are receiving the city_state of the park
      let newParkReviewCount = req.body.new_park_review_count ? req.body.new_park_review_count : res.json({
        isError: true,
        message: errorMsgJSON[lang]["303"] + " - new_park_review_count",
      });

      let parkReviewId = AutogenerateIdcontroller.autogenerateId('PARKREV');

      // Here, Circular json avoided
      if (!req.body.park_id || !req.body.user_id || !req.body.rating_value) { return; }

      var newReview = new Review({
        "reviewId": parkReviewId,
        "parkId": parkId,
        "userId": userId,
        "rating": rating,
        "message": message,
        "cars": cars,
        "people": people,
        "reviewerName": reviewerName,
        "cityState": cityState
      });

      newReview.save(function (err, item) {
        if (err) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 400,
            details: err
          });
        } else {
          // Success saving review
          var querywith = {
            parkId: parkId
          };

          var updatewith = {
            parkReviewCount: newParkReviewCount,
            parkRating: newParkRating
          };

          Park.updateOne(querywith, updatewith, function (err2, res1) {
            if (err) {
              res.json({
                isError: true,
                message: errorMsgJSON[lang]["404"],
                statuscode: 400,
                details: err
              });
            } else {
              res.json({
                isError: false,
                message: errorMsgJSON[lang]["202"],
                statuscode: 200,
                details: null
              });
            }
          });
        }
      });

    } catch (e) {
      res.send(e);
    }


  },

  //Find park via city and search via name or zip code search

  findParkByCity: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var searchTerm = req.body.search_term
      ? req.body.search_term
      : "";
    var cityName = req.body.city_name
      ? req.body.city_name
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "  : Please provide city_name"
      });
    console.log('this is the cityName', cityName)
    var pageNo = req.body.page_no ? req.body.page_no : 1;
    var perPageItem = req.body.per_page_item ? req.body.per_page_item : 20;

    var itemToSkip = (pageNo - 1) * perPageItem;

    // check wheather zip or name
    searchAggrQry = (searchTerm == "") ? [
      {
        $match: {
          isRemoved: false,
          parkCity: cityName.toUpperCase()
        }
      },
      {
        $project: {
          _id: 0,
          parkId: 1,
          parkName: 1,
          parkDefaultPic: 1,
          parkRating: 1,
          cityName: 1,
          cityId: 1
        }
      },
      // {
      //   $skip: itemToSkip
      // },
      // {
      //   $limit: perPageItem
      // }
    ] : [
        {
          $match: {
            $and: [
              {
                isRemoved: false,
                parkCity: cityName.toUpperCase()
              },
              {
                $or: [
                  {
                    parkName: { $regex: searchTerm, $options: "g" }
                  },
                  {
                    parkZipCode: { $regex: searchTerm, $options: "g" }
                  }
                ]
              }
            ]
          }
        },
        {
          $project: {
            _id: 0,
            parkId: 1,
            parkName: 1,
            parkDefaultPic: 1,
            parkRating: 1,
            cityName: 1,
            cityId: 1
          }
        },
        // {
        //   $skip: itemToSkip
        // },
        // {
        //   $limit: perPageItem
        // }
      ];

    Park.aggregate(searchAggrQry).exec((err, item) => {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      } else {
        res.json({
          isError: false,
          message: errorMsgJSON[lang]["200"],
          statuscode: 200,
          details: item
        });
      }
    });
  },

  //Find contests via city and search via name or zip code search

  findReviewsByCity: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var cityState = req.body.city_state
      ? req.body.city_state
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "  : Please provide city_state"
      });

    var searchAggrQry = [
      {
        $match:
        {
          'cityState': cityState.toUpperCase()
        }
      },
    ]

    Review.aggregate(searchAggrQry).exec((err, item) => {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      } else {
        res.json({
          isError: false,
          message: errorMsgJSON[lang]["200"],
          statuscode: 200,
          details: item
        });
      }
    });
  },

  //Find contests via city and search via name or zip code search

  findContestsByCity: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var cityState = req.body.city_state
      ? req.body.city_state
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "  : Please provide city_state"
      });

    var activeOnly = req.body.active_only
      ? req.body.active_only
      : false;

    var searchAggrQry = [
      {
        $match:
        {
          'parkCity': cityState.toUpperCase()
        }
      },
    ]

    if (activeOnly) {
      searchAggrQry = [
        {
          $match:
          {
            'parkCity': cityState.toUpperCase(),
            'isEnabled': activeOnly
          }
        },
      ]
    }

    Contest.aggregate(searchAggrQry).exec((err, item) => {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      } else {
        // Get the activeCount
        var count = 0;

        for (let i = 0; i < item.length; i++) {
          if (item[i].isEnabled == true) {
            count++;
          }
        }

        var querywith = {
          parkCity: cityState
        };

        var updatewith = {
          activeContestCount: count
        };

        // Update parks by cityState with new value
        Park.updateMany(querywith, updatewith, function (err34, res1) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["200"],
            statuscode: 200,
            details: item
          });
        });
      }
    });
  },

  //Find contests via city and search via name or zip code search

  findContestByID: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var contestId = req.body.contest_id
      ? req.body.contest_id
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "  : Please provide city_state"
      });

    let searchAggrQry = [
      {
        $match:
        {
          'contestId': contestId
        }
      },
    ]

    Contest.aggregate(searchAggrQry).exec((err, item) => {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      } else {
        res.json({
          isError: false,
          message: errorMsgJSON[lang]["200"],
          statuscode: 200,
          details: item
        });
      }
    });
  },

  // Add or Edit park
  addEditPark: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var operationType = req.body.operation_type
      ? req.body.operation_type
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide operation_type"
      });
    var parkName = req.body.park_name
      ? req.body.park_name
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_name"
      });
    var parkEmail = req.body.park_email
      ? req.body.park_email
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_email"
      });
    var parkMobile = req.body.park_mobile
      ? req.body.park_mobile
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_mobile"
      });

    var parkAddress = req.body.park_address
      ? req.body.park_address
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_address"
      });
    var parkZipCode = req.body.park_zip_code
      ? req.body.park_zip_code
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_zip_code"
      });
    var parkCity = req.body.park_city
      ? req.body.park_city
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_city"
      });
    // var parkCityId = req.body.park_city_id
    //   ? req.body.park_city_id
    //   : res.json({
    //       isError: true,
    //       statuscode: 303,
    //       details: null,
    //       message: errorMsgJSON[lang]["303"] + " : Please provide park_city_id"
    //     });
    var parkAcre = req.body.park_acre
      ? req.body.park_acre
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_acre"
      });
    var parkLat = req.body.park_lat
      ? req.body.park_lat
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_lat"
      });
    var parkLong = req.body.park_long
      ? req.body.park_long
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_long"
      });
    var parkAmenities = req.body.park_amenities
      ? req.body.park_amenities
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_amenities"
      });
    var parkDetails = req.body.park_details
      ? req.body.park_details
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_details"
      });
    var parkPavilionDetails = req.body.park_pavilions
      ? req.body.park_pavilions
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_pavilions"
      });
    // var parkPictures = req.body.park_pictures
    //   ? req.body.park_pictures
    //   : res.json({
    //       isError: true,
    //       statuscode: 303,
    //       details: null,
    //       message: errorMsgJSON[lang]["303"] + " : Please provide park_pictures"
    //     });
    var parkPictures = req.body.park_pictures
      ? req.body.park_pictures
      : ["https://via.placeholder.com/550x390?text=No+park+image+found"]
    // var parkDefaultPicture = req.body.park_default_picture
    //   ? req.body.park_default_picture
    //   : res.json({
    //       isError: true,
    //       statuscode: 303,
    //       details: null,
    //       message:
    //         errorMsgJSON[lang]["303"] + " : Please provide  park_default_picture"
    //     });
    var parkDefaultPicture = req.body.park_default_picture
      ? req.body.park_default_picture
      : "https://via.placeholder.com/550x390?text=No+park+image+found"

    var lastUpdatedBy = req.body.last_updated_by
      ? req.body.last_updated_by
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide last_updated_by"
      });
    var parkId = req.body.park_id ? req.body.park_id : "";

    var isParkVerified = req.body.park_verified
      ? req.body.park_verified
      : false;

    var parkMessage = req.body.park_message ? req.body.park_message : ""

    let parkLocation = {
      type: "Point",
      coordinates: [parkLong, parkLat]
    };

    try {
      if (operationType.toUpperCase() == "EDIT") {
        var querywith = {
          parkId: parkId
        };

        var updatewith = {
          parkName: parkName,
          parkMobile: parkMobile,
          parkEmail: parkEmail,
          parkAddress: parkAddress,
          parkZipCode: parkZipCode,
          parkCity: parkCity,
          // parkCityId: parkCityId,
          parkAcreage: parkAcre,
          parkAmenities: parkAmenities,
          parkDetails: parkDetails,
          parkDefaultPic: parkDefaultPicture,
          parkPictures: parkPictures,
          lastUpdatedBy: lastUpdatedBy,
          isParkVerified: isParkVerified,
          parkMessage: parkMessage,
          parkCoordinate: parkLocation,
          pavilions: parkPavilionDetails,
          // $push: {
          //   editedBy: lastupdatedby // $push or $set
          // }
        };

        Park.updateOne(querywith, updatewith, function (err, res1) {
          if (err) {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["404"],
              statuscode: 400,
              details: err
            });
          } else {
            if (res1.nModified == 1) {
              res.json({
                isError: false,
                message: errorMsgJSON[lang]["200"],
                statuscode: 200,
                details: null
              });
            } else {
              res.json({
                isError: true,
                message: errorMsgJSON[lang]["400"],
                statuscode: 400,
                details: null
              });
            }
          }
        });
      } else {
        var newPark = new Park({
          parkName: parkName,
          parkMobile: parkMobile,
          parkEmail: parkEmail,
          parkAddress: parkAddress,
          parkZipCode: parkZipCode,
          parkCity: parkCity,
          // parkCityId: parkCityId,
          parkAcreage: parkAcre,
          parkCoordinate: parkLocation,
          parkAmenities: parkAmenities,
          parkDetails: parkDetails,
          pavilions: parkPavilionDetails,
          parkDefaultPic: parkDefaultPicture,
          parkPictures: parkPictures,
          lastUpdatedBy: lastUpdatedBy,
          isParkVerified: isParkVerified,
          parkMessage: parkMessage
        });

        newPark.save(function (err, item) {
          if (item) {
            res.json({
              isError: false,
              message: errorMsgJSON[lang]["202"],
              statuscode: 200,
              details: null
            });
          }
          if (err) {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["404"],
              statuscode: 400,
              details: err
            });
          }
        });
      }
    } catch (e) {
      res.send(e);
    }
  },

  // Add or Edit contest
  addEditContest: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var operationType = req.body.operation_type
      ? req.body.operation_type
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide operation_type"
      });
    // sponsorName
    // awardAmount
    // startDate
    // endDate
    // isEnabled
    // sponsorLogo

    var sponsorName = req.body.sponsor_name
      ? req.body.sponsor_name
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide sponsor_name"
      });
    var awardAmount = req.body.award_amount
      ? req.body.award_amount
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide award_amount"
      });
    var startDate = req.body.start_date
      ? req.body.start_date
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide start_date"
      });

    var endDate = req.body.end_date
      ? req.body.end_date
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide end_date"
      });
    var isEnabled = req.body.is_enabled
      ? req.body.is_enabled
      : false;
    var sponsorLogo = req.body.sponsor_logo
      ? req.body.sponsor_logo
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide sponsor_logo"
      });

    var parkCity = req.body.park_city
      ? req.body.park_city
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_city"
      });

    var mysteryPicture = req.body.mystery_picture
      ? req.body.mystery_picture
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide mystery_picture"
      });

    var contestType = req.body.contest_type
      ? req.body.contest_type
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide contest_type"
      });

    var contestDetails = req.body.contest_details
      ? req.body.contest_details
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide contest_details"
      });

    var supportEmail = req.body.support_email
      ? req.body.support_email
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide support_email"
      });

    try {
      if (operationType.toUpperCase() == "EDIT") {
        var contestId = req.body.contest_id
          ? req.body.contest_id
          : res.json({
            isError: true,
            statuscode: 303,
            details: null,
            message: errorMsgJSON[lang]["303"] + " : Please provide contest_id"
          });

        var querywith = {
          contestId: contestId
        };

        var updatewith = {
          sponsorName: sponsorName,
          awardAmount: awardAmount,
          startDate: startDate,
          endDate: endDate,
          isEnabled: isEnabled,
          sponsorLogo: sponsorLogo,
          parkCity: parkCity,
          mysteryPicture: mysteryPicture,
          contestType: contestType,
          contestDetails: contestDetails,
          supportEmail: supportEmail
        };

        Contest.updateOne(querywith, updatewith, function (err, res1) {
          if (err) {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["404"],
              statuscode: 400,
              details: err
            });
          } else {
            if (res1.nModified == 1) {
              res.json({
                isError: false,
                message: errorMsgJSON[lang]["200"],
                statuscode: 200,
                details: null
              });
            } else {
              res.json({
                isError: true,
                message: errorMsgJSON[lang]["400"],
                statuscode: 400,
                details: null
              });
            }
          }
        });
      } else {
        var newContest = new Contest({
          sponsorName: sponsorName,
          awardAmount: awardAmount,
          startDate: startDate,
          endDate: endDate,
          isEnabled: isEnabled,
          sponsorLogo: sponsorLogo,
          parkCity: parkCity,
          mysteryPicture: mysteryPicture,
          contestType: contestType,
          contestDetails: contestDetails,
          supportEmail: supportEmail
        });

        newContest.save(function (err, item) {
          if (item) {
            res.json({
              isError: false,
              message: errorMsgJSON[lang]["202"],
              statuscode: 200,
              details: null
            });
          }
          if (err) {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["404"],
              statuscode: 400,
              details: err
            });
          }
        });
      }
    } catch (e) {
      res.send(e);
    }
  },

  removePark: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var parkId = req.body.park_id
      ? req.body.park_id
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_id"
      });

    var querywith = {
      parkId: parkId
    };
    var updatewith = {
      isRemoved: true
    };
    Park.updateOne(querywith, updatewith, function (err, res1) {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      } else {
        if (res1.nModified == 1) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["200"],
            statuscode: 200,
            details: null
          });
        } else {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["400"],
            statuscode: 400,
            details: null
          });
        }
      }
    });
  },

  removeContest: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var contestId = req.body.contest_id
      ? req.body.contest_id
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide contest_id"
      });

    var querywith = {
      contestId: contestId
    };
    var updatewith = {
      isRemoved: true
    };
    Contest.deleteOne(querywith, function (err, res1) {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      } else {
        if (res1.n == 1) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["200"],
            statuscode: 200,
            details: null
          });
        } else {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["400"],
            statuscode: 400,
            details: null
          });
        }
      }
    });
  },

  // Add or Edit pavillions
  addEditPavillions: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var operationType = req.body.operation_type
      ? req.body.operation_type
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide operation_type"
      });
    var pavillionName = req.body.pavillion_name
      ? req.body.pavillion_name
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide pavillion_name"
      });
    var parkId = req.body.park_id
      ? req.body.park_id
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_id"
      });
    var pavillionLat = req.body.pavilion_lat
      ? req.body.pavilion_lat
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide pavilion_lat"
      });
    var pavillionLong = req.body.pavilion_long
      ? req.body.pavilion_long
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide pavilion_long"
      });
    var isReservable = req.body.is_reservable
      ? req.body.is_reservable
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide is_reservable"
      });
    var pavillionDefaultPic = req.body.pavilion_default_pic
      ? req.body.pavilion_default_pic
      : res.json({
        message:
          errorMsgJSON[lang]["303"] + " : Please provide pavilion_default_pic"
      });
    var pavillionAmenities = req.body.pavilion_amenities
      ? req.body.pavilion_amenities
      : res.json({
        message:
          errorMsgJSON[lang]["303"] + " : Please provide pavilion_amenities"
      });
    var pavilionReservationUrl = req.body.pavilion_reservation_url
      ? req.body.pavilion_reservation_url
      : res.json({
        message:
          errorMsgJSON[lang]["303"] +
          " : Please provide pavilion_reservation_url"
      });
    var lastUpdatedBy = req.body.last_updated_by
      ? req.body.last_updated_by
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide last_updated_by"
      });
    var pavillionId = req.body.pavillion_id ? req.body.pavillion_id : "";

    let pavillionLocation = {
      type: "Point",
      coordinates: [pavillionLong, pavillionLat]
    };

    isReservable = isReservable == "Y" ? true : false;

    if (operationType.toUpperCase() == "EDIT") {
      var querywith = {
        pavillionId: pavillionId,
        parkId: parkId
      };
      var updatewith = {
        pavillionName: pavillionName,
        pavillionDefaultPic: pavillionDefaultPic,
        pavillionAmenities: pavillionAmenities,
        isReservable: isReservable,
        lastUpdatedBy: lastUpdatedBy,
        pavilionCoordinate: pavillionLocation,
        pavilionReservationUrl: pavilionReservationUrl,
        $push: {
          editedBy: lastupdatedby // $push or $set
        }
      };
      Pavillion.updateOne(querywith, updatewith, function (err, res1) {
        if (err) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 400,
            details: null
          });
        } else {
          if (res1.nModified == 1) {
            res.json({
              isError: false,
              message: errorMsgJSON[lang]["200"],
              statuscode: 200,
              details: null
            });
          } else {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["400"],
              statuscode: 400,
              details: null
            });
          }
        }
      });
    } else {
      var newPavillion = new Pavillion({
        pavillionName: pavillionName,
        parkId: parkId,
        pavillionDefaultPic: pavillionDefaultPic,
        pavillionAmenities: pavillionAmenities,
        isReservable: isReservable,
        lastUpdatedBy: lastUpdatedBy,
        pavilionCoordinate: pavillionLocation,
        pavilionReservationUrl: pavilionReservationUrl,
        editedBy: lastUpdatedBy
      });

      newPavillion.save(function (err, item) {
        if (item) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["202"],
            messageid: data.sid,
            statuscode: 200,
            details: null
          });
        }
        if (err) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 400,
            details: null
          });
        }
      });
    }
  },

  addEditField: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var operationType = req.body.operation_type
      ? req.body.operation_type
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide operation_type"
      });
    var fieldName = req.body.field_name
      ? req.body.field_name
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide field_name"
      });
    var parkId = req.body.park_id
      ? req.body.park_id
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide park_id"
      });
    var fieldLat = req.body.field_lat
      ? req.body.field_lat
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide field_lat"
      });
    var fieldLong = req.body.field_long
      ? req.body.field_long
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide field_long"
      });
    var fieldPhotos = req.body.field_photos
      ? req.body.field_photos
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide field_photos"
      });
    var fieldSchedule = req.body.field_schedule
      ? req.body.field_schedule
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide field_schedule"
      });
    var lastUpdatedBy = req.body.last_updated_by
      ? req.body.last_updated_by
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide last_updated_by"
      });
    var fieldId = req.body.field_id ? req.body.field_id : "";

    let fieldLocation = {
      type: "Point",
      coordinates: [fieldLong, fieldLat]
    };

    // isReservable = isReservable=='Y'? true : false

    if (operationType.toUpperCase() == "EDIT") {
      var querywith = {
        fieldId: fieldId,
        parkId: parkId
      };
      var updatewith = {
        fieldName: fieldName,
        fieldPhotos: JSON.parse(fieldPhotos),
        fieldSchedule: JSON.parse(fieldSchedule),
        lastUpdatedBy: lastUpdatedBy,
        fieldCoordinate: fieldLocation,
        $push: {
          editedBy: lastupdatedby // $push or $set
        }
      };
      Field.updateOne(querywith, updatewith, function (err, res1) {
        if (err) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 400,
            details: null
          });
        } else {
          if (res1.nModified == 1) {
            res.json({
              isError: false,
              message: errorMsgJSON[lang]["200"],
              statuscode: 200,
              details: null
            });
          } else {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["400"],
              statuscode: 400,
              details: null
            });
          }
        }
      });
    } else {
      var newField = new Field({
        fieldName: fieldName,
        fieldId: fieldId,
        fieldPhotos: JSON.parse(fieldPhotos),
        fieldSchedule: JSON.parse(fieldSchedule),
        lastUpdatedBy: lastUpdatedBy,
        fieldCoordinate: fieldLocation,
        editedBy: lastUpdatedBy
      });

      newField.save(function (err, item) {
        if (item) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["202"],
            messageid: data.sid,
            statuscode: 200,
            details: null
          });
        }
        if (err) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 400,
            details: null
          });
        }
      });
    }
  },

  // Change reservable status of the pavillion
  changeReservableStatus: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var pavillionId = req.body.pavillion_id
      ? req.body.pavillion_id
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide pavillion_id"
      });
    var reservableStat = req.body.is_reservable
      ? req.body.is_reservable
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide is_reservable"
      });

    reservableStat = reservableStat == "Y" ? true : false;

    let querywith = {
      pavillionId: pavillionId
    };

    let updatewith = {
      isReservable: reservableStat
    };

    Pavillion.updateOne(querywith, updatewith, function (err, res1) {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      } else {
        if (res1.nModified == 1) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["200"],
            statuscode: 200,
            details: null
          });
        } else {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["400"],
            statuscode: 400,
            details: null
          });
        }
      }
    });
  },

  // reply to a review
  replyReview: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var reviewId = req.body.review_id
      ? req.body.review_id
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide review_id"
      });
    var replypersonId = req.body.reply_person_id
      ? req.body.reply_person_id
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide reply_person_id"
      });
    var replyPersonName = req.body.reply_person_name
      ? req.body.reply_person_name
      : res.json({
        message:
          errorMsgJSON[lang]["303"] + " : Please provide reply_person_name"
      });
    var replyContent = req.body.reply_content
      ? req.body.reply_content
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " : Please provide reply_content"
      });
  }
};
