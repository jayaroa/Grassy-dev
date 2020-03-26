const mongoose = require("mongoose");
const User = require("../models/user");
const PushNotification = require("../models/pushnotifications");
const Park = require("../models/park");
const Amenity = require("../models/amenity");
const City = require("../models/city");
const Globaldetails = require("../models/globaldetails");
const Paviliondetails = require("../models/paviliondetails");
const imageUpload = require("../../../services/ImageUploadBase64");
const Mailercontroller = require("../../../services/mailer");
const errorMsgJSON = require("../../../services/errors.json");
const notificationService = require('../../../services/FirebaseOps')

module.exports = {

  //Get City admin list
  getCityAdminList: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";

    let aggrQry = [
      {
        $match: {
          userType: 'CITY-MANAGER'
        }
      },
      {
        $project: {
          "_id": 0,
          "userId": 1,
          "userType": 1,
          "isActive": 1,
          "isApproved": 1,
          "isLoggedIn": 1,
          "name": 1,
          "email": 1,
          "mobile": 1,
          "profileCreatedAt": 1,
        }
      }
    ]

    User.aggregate(aggrQry, function (err, response) {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      }
      else {
        if (response) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["200"],
            statuscode: 200,
            details: response
          });
        }
      }
    })
  },

  // Approve city admin account
  approveCityAdmin: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var cityAdminId = req.body.city_admin_id
      ? req.body.city_admin_id
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide city_admin_id"
      });

    let serachOption = { userId: cityAdminId };

    User.findOne(serachOption, function (err, item) {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      } else {
        if (item) {
          // console.log(item)
          let approvalType = item.isApproved ? false : true
          let updateFieldsWith = {
            $set: {
              isApproved: approvalType
            }
          };

          User.updateOne(serachOption, updateFieldsWith, function (err, res1) {
            if (err) {
              res.json({
                isError: true,
                message: "Some error occured while updating.",
                statuscode: 404,
                details: null
              });
            } else {
              if (res1.nModified > 0) {
                res.json({
                  isError: false,
                  message: errorMsgJSON[lang]["200"],
                  statuscode: 200,
                  details: null
                });
              }
            }
          });
        } else {
          res.json({
            isError: false,
            message: "No record found",
            statuscode: 200,
            details: null
          });
        }
      }
    });
  },

  /////////////////////////////////////////////////////////////////////////////////

  // Add or Edit global amenity list
  addEditAmenity: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var operationType = req.body.operation_type
      ? req.body.operation_type
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide operation_type"
      });
    var amenityName = req.body.amenity_name
      ? req.body.amenity_name
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide amenity_name"
      });
    var amenityId = req.body.amenity_id ? req.body.amenity_id : "";

    if (operationType.toUpperCase() == "EDIT") {
      var querywith = {
        amenityId: amenityId
      };
      var updatewith = {
        amenityName: amenityName
      };
      Amenity.updateOne(querywith, updatewith, function (err, res1) {
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
      var newAmenity = new Amenity({
        amenityName: amenityName
      });

      newAmenity.save(function (err, item) {
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
            details: null
          });
        }
      });
    }
  },

  // remove / soft delete Amenity
  removeAmenity: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var amenityId = req.body.amenity_id ? req.body.amenity_id : res.json({
      isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide amenity_id"
    });

    let querywith = {
      amenityId: amenityId
    }

    let updatewith = {
      "isRemoved": true
    }

    Amenity.updateOne(querywith, updatewith, function (err, res1) {
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

  // Get all amenity list
  getAllAmenity: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";

    Amenity.find({ "isRemoved": false }, function (err, response) {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      }
      else {
        if (response) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["200"],
            statuscode: 200,
            details: response
          });
        }
      }
    })

  },

  ///////////////////////////////////////////////////////////////////////////////////


  // Add or Edit global details list
  addEditDetails: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var operationType = req.body.operation_type
      ? req.body.operation_type
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide operation_type"
      });
    var detailsName = req.body.gdetails_name
      ? req.body.gdetails_name
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide details_name"
      });
    var gdetailsId = req.body.gdetails_id ? req.body.gdetails_id : "";

    if (operationType.toUpperCase() == "EDIT") {
      var querywith = {
        gdetailsId: gdetailsId
      };
      var updatewith = {
        gdetailsName: detailsName
      };
      Globaldetails.updateOne(querywith, updatewith, function (err, res1) {
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
      var newDetails = new Globaldetails({
        gdetailsName: detailsName
      });

      newDetails.save(function (err, item) {
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
            details: null
          });
        }
      });
    }
  },

  removeDetails: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var detailsId = req.body.gdetails_id ? req.body.gdetails_id : res.json({
      isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide details_id"
    });

    let querywith = {
      gdetailsId: detailsId
    }

    let updatewith = {
      "isRemoved": true
    }

    Globaldetails.updateOne(querywith, updatewith, function (err, res1) {
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

  // Get all global details list
  getAllGlobalDetails: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    Globaldetails.find({ "isRemoved": false }, function (err, response) {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      }
      else {
        if (response) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["200"],
            statuscode: 200,
            details: response
          });
        }
      }
    })
  },

  ////////////////////////////////////////////////////////////////////////////////////

  // Add or Edit pavilion details list
  addEditPavilionDetails: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var operationType = req.body.operation_type
      ? req.body.operation_type
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide operation_type"
      });
    var pdetailsName = req.body.pdetails_name
      ? req.body.pdetails_name
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide pdetails_name"
      });
    var pdetailsId = req.body.pdetails_id ? req.body.pdetails_id : "";

    if (operationType.toUpperCase() == "EDIT") {
      var querywith = {
        pdetailsId: pdetailsId
      };
      var updatewith = {
        pdetailsName: pdetailsName
      };
      Paviliondetails.updateOne(querywith, updatewith, function (err, res1) {
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
      var newDetails = new Paviliondetails({
        pdetailsName: pdetailsName
      });

      newDetails.save(function (err, item) {
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
            details: null
          });
        }
      });
    }
  },

  removePavilionDetails: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var pdetailsId = req.body.pdetails_id ? req.body.pdetails_id : res.json({
      isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide pavilion_details_id"
    });

    let querywith = {
      pdetailsId: pdetailsId
    }

    let updatewith = {
      "isRemoved": true
    }

    Paviliondetails.updateOne(querywith, updatewith, function (err, res1) {
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

  // Get all pavilion details list
  getAllPavilionDetails: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    Paviliondetails.find({ "isRemoved": false }, function (err, response) {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      }
      else {
        if (response) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["200"],
            statuscode: 200,
            details: response
          });
        }
      }
    })
  },


  ////////////////////////////////////////////////////////////////////////////////////

  // Add or Edit city list
  addEditCity: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var operationType = req.body.operation_type
      ? req.body.operation_type
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide operation_type"
      });
    var cityName = req.body.city_name
      ? req.body.city_name
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide city_name"
      });
    var cityId = req.body.city_id ? req.body.city_id : "";

    if (operationType.toUpperCase() == "EDIT") {
      var querywith = {
        cityId: cityId
      };
      var updatewith = {
        cityName: cityName
      };
      City.updateOne(querywith, updatewith, function (err, res1) {
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
      var newCity = new City({
        cityName: cityName
      });

      newCity.save(function (err, item) {
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
            details: null
          });
        }
      });
    }
  },

  removeCity: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var cityId = req.body.city_id ? req.body.city_id : res.json({
      isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide city_id"
    });

    let querywith = {
      cityId: cityId
    }

    let updatewith = {
      "isRemoved": true
    }

    City.updateOne(querywith, updatewith, function (err, res1) {
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

  // Get all city list
  getCityState: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";

    var cityName = req.body.city_name ? req.body.city_name
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " - city_name "
      });

    var cityZip = req.body.city_zip ? req.body.city_zip
      : res.json({
        isError: true,
        statuscode: 303,
        details: null,
        message: errorMsgJSON[lang]["303"] + " - city_zip "
      });

    let searchQry = [
      {
        $match: {
          $and: [
            {
              zips: cityZip,
              cityName: { $regex: cityName, $options: "i" }
            }
          ]
        }
      },
      {
        $project: {
          _id: 0,
          cityName: 1,
          cityDisplayName: 1,
          cityId: 1,
          state: 1,
          zips: 1
        }
      }
    ]


    City.aggregate(searchQry).exec((err, response) => {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      }
      else {
        if (response) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["200"],
            statuscode: 200,
            details: response
          });
        }
      }
    })
  },

  // Get all city list
  getAllCities: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var searchTerm = req.body.search_term ? req.body.search_term : res.json({
      isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide search_term"
    });

    let searchQry = [
      {
        $match: {
          $and: [
            {
              isRemoved: false,
              cityName: { $regex: searchTerm, $options: "i" }
            }
          ]
        }
      },
      {
        $project: {
          _id: 0,
          cityName: 1,
          cityDisplayName: 1,
          cityId: 1,
          state: 1,
          zips: 1
        }
      }
    ]

    console.log('SEARCH QUERY')
    console.log(searchQry)

    City.aggregate(searchQry).exec((err, response) => {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      } else {
        if (response) {
          res.json({
            isError: false,
            message: errorMsgJSON[lang]["200"],
            statuscode: 200,
            details: response
          });
        }
      }
    })
  },


  ////////////////////////////////////////////////////////////////////////////////////

  //ToDo :  Check boundary (wheather within City)
  addEditPark: (req, res, next) => {

    let lang = req.headers.language ? req.headers.language : "EN";
    var operationType = req.body.operation_type
      ? req.body.operation_type
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide operation_type"
      });
    var parkName = req.body.park_name
      ? req.body.park_name
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide park_name"
      });
    var parkEmail = req.body.park_email
      ? req.body.park_email
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide park_email"
      });
    var parkMobile = req.body.park_mobile
      ? req.body.park_mobile
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide park_mobile"
      });
    var parkAddress = req.body.park_address
      ? req.body.park_address
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide park_address"
      });
    var parkZipCode = req.body.park_zip_code
      ? req.body.park_zip_code
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide park_zip_code"
      });
    var parkCity = req.body.park_city
      ? req.body.park_city
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide park_city"
      });
    var parkLat = req.body.park_lat
      ? req.body.park_lat
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide park_lat"
      });
    var parkLong = req.body.park_long
      ? req.body.park_long
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide park_long"
      });
    var parkAmenities = req.body.park_amenities
      ? req.body.park_amenities
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide park_amenities"
      });
    var parkDetails = req.body.park_details
      ? req.body.park_details
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide park_details"
      });
    var lastUpdatedBy = req.body.last_updated_by
      ? req.body.last_updated_by
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + "Please provide last_updated_by"
      });
    var parkId = req.body.park_id ? req.body.park_id : "";

    let parkLocation = {
      type: "Point",
      coordinates: [parkLong, parkLat]
    };

    if (operationType.toUpperCase() == "EDIT") {
      var querywith = {
        parkId: parkId
      };
      var updatewith = {
        parkName: parkName,
        parkEmail: parkEmail,
        parkMobile: parkMobile,
        parkAddress: parkAddress,
        parkZipCode: parkZipCode,
        parkCity: parkCity,
        parkAmenities: parkAmenities,
        parkDetails: parkDetails,
        lastUpdatedBy: lastUpdatedBy,
        parkCoordinate: parkLocation,
        $push: {
          editedBy: lastUpdatedBy // $push or $set
        }
      };
      Park.updateOne(querywith, updatewith, function (err, res1) {
        console.log(err)
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
              details: err
            });
          }
        }
      });
    } else {
      var newPark = new Park({
        parkName: parkName,
        parkEmail: parkEmail,
        parkMobile: parkMobile,
        parkAddress: parkAddress,
        parkZipCode: parkZipCode,
        parkCity: parkCity,
        parkCoordinate: parkLocation,
        parkAmenities: parkAmenities,
        parkDetails: parkDetails,
        editedBy: lastUpdatedBy,
        lastUpdatedBy: lastUpdatedBy
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
  },


  removePark: (req, res, next) => {

  },


  approvePark: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var parkId = req.body.park_id
      ? req.body.park_id
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + " Please provide park_id"
      });

    let serachOption = { parkId: parkId };

    Park.findOne(serachOption, function (err, item) {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: err
        });
      } else {
        if (item) {
          let approvalType = item.isParkVerified ? false : true
          let updateFieldsWith = {
            $set: {
              isParkVerified: approvalType
            }
          };

          Park.updateOne(serachOption, updateFieldsWith, function (err, res1) {
            if (err) {
              console.log("bhsdjodshjhjgfdjdsgsdgmnksdfbsdfkjj", err);
              res.json({
                isError: true,
                message: "Some error occured while updating.",
                statuscode: 404,
                details: err
              });
            } else {
              if (res1.nModified > 0) {
                res.json({
                  isError: false,
                  message: errorMsgJSON[lang]["200"],
                  statuscode: 200,
                  details: null
                });
              }
            }
          });
        } else {
          res.json({
            isError: false,
            message: "No record found",
            statuscode: 200,
            details: err
          });
        }
      }
    });
  },

  //Find park via name or zip code search

  findPark: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var searchTerm = req.body.search_term
      ? req.body.search_term
      : "";
    var pageNo = req.body.page_no ? req.body.page_no : 1;
    var perPageItem = req.body.per_page_item ? req.body.per_page_item : 10;

    var itemToSkip = (pageNo - 1) * perPageItem;

    // check wheather zip or name
    searchAggrQry =
      searchTerm == ""
        ? [
          {
            $match: {
              isRemoved: false
            }
          },
          {
            $skip: itemToSkip
          },
          {
            $limit: perPageItem
          }
        ]
        : [
          {
            $match: {
              $and: [
                {
                  isRemoved: false
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
              parkRating: 1,
              isParkVerified: 1,
              isRemoved: 1,
              parkDefaultPic: 1,
              parkPictures: 1,
              parkLatestReviews: 1,
              parkAmenities: 1,
              parkDetails: 1,
              pavilions: 1,
              fields: 1,
              editedBy: 1,
              parkName: 1,
              urbanId: 1,
              parkZipCode: 1,
              parkType: 1,
              parkCity: 1,
              parkCoordinate: 1,
              parkAcreage: 1,
              createdAt: 1,
              updatedAt: 1,
              parkId: 1
            }
          },

          {
            $group: {
              "_id": {
                "parkZipCode": "$parkZipCode",

              },
              "parkCity": {
                $first: "$parkCity"
              },
              "parkName": {
                $first: "$parkName"
              },
              "parkZipCode": {
                $first: "$parkZipCode"
              },

            }
          },
          {
            $project: {
              _id: 0,
              "parkCity": 1,
              "parkName": 1,
              "parkZipCode": 1

            }
          },

        ];

    Park.aggregate(searchAggrQry).exec((err, item) => {



      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });

      }
      else {
        if (item.length == 0) {


          res.json({
            isError: false,
            message: errorMsgJSON[lang]["1076"],
            statuscode: 1076,
            details: []

          })
        }
        else {
          if (searchTerm == item[0].parkName) {
            let agg = [
              {
                $match: {
                  'parkName': item[0].parkName,

                },

              },
              {
                $skip: itemToSkip
              },
              {
                $limit: perPageItem
              }
            ]
            Park.aggregate(agg).exec((err, item) => {
              res.json({
                isError: false,
                message: errorMsgJSON[lang]["200"],
                statuscode: 200,
                details: item
              })
            })

          }
          else if (searchTerm == item[0].parkZipCode) {
            let agg = [
              {
                $match: {
                  'parkCity': item[0].parkCity,

                },

              },
              {
                $skip: itemToSkip
              },
              {
                $limit: perPageItem
              }
            ]
            Park.aggregate(agg).exec((err, item) => {
              res.json({
                isError: false,
                message: errorMsgJSON[lang]["200"],
                statuscode: 200,
                details: item
              })
            })
          }
          else {

            let agg = searchTerm == ""
              ? [
                {
                  $match: {
                    isRemoved: false
                  }
                },
                {
                  $skip: itemToSkip
                },
                {
                  $limit: perPageItem
                }
              ]
              : [
                {
                  $match: {
                    $and: [
                      {
                        isRemoved: false
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
                    parkRating: 1,
                    isParkVerified: 1,
                    isRemoved: 1,
                    parkDefaultPic: 1,
                    parkPictures: 1,
                    parkLatestReviews: 1,
                    parkAmenities: 1,
                    parkDetails: 1,
                    pavilions: 1,
                    fields: 1,
                    editedBy: 1,
                    parkName: 1,
                    urbanId: 1,
                    parkZipCode: 1,
                    parkType: 1,
                    parkCity: 1,
                    parkCoordinate: 1,
                    parkAcreage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    parkId: 1
                  }
                },
                {
                  $skip: itemToSkip
                },
                {
                  $limit: perPageItem
                }



              ];
            Park.aggregate(agg).exec((err, item) => {
              res.json({
                isError: false,
                message: errorMsgJSON[lang]["200"],
                statuscode: 200,
                details: item
              })
            })

          }

        }

      }




    });
  },

  getSingleParkDetails: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var parkId = req.body.park_id
      ? req.body.park_id
      : res.json({
        isError: true, statuscode: 303, details: null, message: errorMsgJSON[lang]["303"] + " Please provide park_id"
      });

    Park.find({ 'parkId': parkId }, function (err, response) {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      } else {
        // console.log(response);
        res.json({
          isError: false,
          message: errorMsgJSON[lang]["200"],
          statuscode: 200,
          details: response[0]
        });
      }
    })
  },

  generateNotificationsToAllCityManagers: async (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    console.log('this is req.body', req.body)
    if (!(req.body.title && req.body.description && req.body.userId && req.body.to && req.body.cityId && req.body.cityName && req.body.user)) {
      res.json({
        isError: true,
        message: 'all fields are required (title,description,userId,to)'
      })
      return;
    }
    const toValues = ['all', 'users', 'city-admins'];
    if (!toValues.includes(req.body.to)) {
      res.json({
        isError: true,
        message: `to value should be on of ${toValues}`
      })
      return;
    }
    const { title, userId, description, to, cityName, cityId } = req.body;
    const pushNotification = new PushNotification({
      title, userId, description, to
    })
    const createdPushNotification = await pushNotification.save();

    // User.find({ userType: 'USER', cityId: { $exists: true, $ne: '' } }).then(data => console.log('this is data', data))
    let aggrQry = []
    if (req.body.to === 'city-admins') {
      aggrQry = [
        {
          $match: {
            userType: 'CITY-MANAGER'
          }
        },
        {
          $project: {
            "_id": 0,
            "userId": 1,
            "userType": 1,
            "isActive": 1,
            "isApproved": 1,
            "isLoggedIn": 1,
            "name": 1,
            "email": 1,
            "mobile": 1,
            "profileCreatedAt": 1,
            "fcmToken": 1
          }
        }
      ]
    } else if (req.body.to === 'users') {
      console.log('this is the cityId', req.body.cityName)
      const updatedPark = await Park.updateOne({
        isRemoved: false,
        parkCity: cityName.toUpperCase()
      }, { $addToSet: { "favouriteUser": req.body.user } });
      try {
        const parks = await Park.aggregate([
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
              cityId: 1,
              favouriteUser: 1
            }
          },
          // {
          //   $skip: itemToSkip
          // },
          // {
          //   $limit: perPageItem
          // }
        ]);
        console.log('this is the park', parks);
        await Promise.all(parks.map(async (item) => {
          let users = []
          if (item.favouriteUser && item.favouriteUser.length) {
            users = await User.find({ userId: { $in: item.favouriteUser } })
          }
          console.log('this is the users', users)
          await Promise.all(users.filter(usr => usr.fcmToken).map(usr => {
            console.log('this is usr._id', usr)
            return notificationService(usr.fcmToken, usr.userId, req.body.title || 'Notification title', req.body.title, req.body.description, createdPushNotification._id, req.body.badgeCount)
          }))
          return users
        }));
        res.json({
          isError: false,
          message: errorMsgJSON[lang]["200"],
          statuscode: 200,
          details: createdPushNotification
        });
        return;
      } catch (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
        return;
      }


    } else {
      aggrQry = aggrQry = [
        {
          $match: {
            $or: [{ userType: 'CITY-MANAGER' }, { userType: 'USER' }]

          }
        },
        {
          $project: {
            "_id": 0,
            "userId": 1,
            "userType": 1,
            "isActive": 1,
            "isApproved": 1,
            "isLoggedIn": 1,
            "name": 1,
            "email": 1,
            "mobile": 1,
            "profileCreatedAt": 1,
            "fcmToken": 1
          }
        }
      ]
    }
    User.aggregate(aggrQry, function (err, response) {
      if (err) {
        res.json({
          isError: true,
          message: errorMsgJSON[lang]["404"],
          statuscode: 400,
          details: null
        });
      }
      else {
        if (response) {
          Promise.all(response.filter(item => item.fcmToken).map(item => {
            console.log('this is item._id', item)
            return notificationService(item.fcmToken, item.userId, req.body.title || 'Notification title', req.body.title, req.body.description, createdPushNotification._id, req.body.badgeCount)
          }))
            .then(data => {
              res.json({
                isError: false,
                message: errorMsgJSON[lang]["200"],
                statuscode: 200,
                details: createdPushNotification
              });
            })
            .catch(err => {
              res.json({
                isError: true,
                message: errorMsgJSON[lang]["404"],
                statuscode: 400,
                details: null
              })
            })

        }
      }
    })
  },

  getAllPushNotifications: async (req, res) => {
    if (!req.body.userId) {
      res.json({
        isError: true,
        message: 'userId is required'
      })
      return;
    }
    const nots = await PushNotification.find({ userId: req.body.userId }).sort({ createdAt: -1 });
    res.json({
      isError: false,
      data: nots
    })
  },

  updateFcmToken: async (req, res, next) => {
    console.log('this is req.headers', req.body);
    if (!req.body.fcmToken || !req.body.id) {
      res.json({
        isError: true,
        message: 'fcmtoken is required'
      })
      return;
    }
    User.update({ _id: req.body.id }, { $set: { fcmToken: req.body.fcmToken } })
      .then(() => {
        res.json({ message: 'success' })

      })
      .catch(err => {
        console.log('this is error', err)
        res.json({
          isError: true,
          message: 'error comes in updating user'
        })
      })
  },



  getDashboardData: (req, res, next) => {
    // No of parks
    // No of cities/cityadmins
    // No of users
    //
  }
};
