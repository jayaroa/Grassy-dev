    const mongoose = require("mongoose");
    const jwt = require("jsonwebtoken");
    const User = require("../models/user");
    const Park = require("../models/park");
    const Contest = require("../models/contest");
    const city = require("../models/city");

    const Amenity = require("../models/amenity");

    const Review = require("../models/review");
    const bcrypt = require("bcrypt");
    const SALT_WORK_FACTOR = 10;
    // const imageUpload = require("../../../services/ImageUploadBase64");
    const Mailercontroller = require("../../../services/mailer");
    const errorMsgJSON = require("../../../services/errors.json");
    const config = require("../config/globals/keyfile");
    module.exports = {
      /** ******************************* AUTH-RELATED FEATURES start__******************************** */

      // This api used to make a park un favourit for particular user
      // made by Ankur on 14-01-20
      makeUnfovouritePark: (req, res, next) => {
          let lang = req.headers.language ? req.headers.language : "EN";
          try {

              let parkId = req.body.parkId
              ? req.body.parkId
              : res.json({
                  isError: true,
                  statuscode: 303,
                  details: null,
                  message: errorMsgJSON[lang]["303"] + " parkId"
                });

              let userId = req.body.userId
              ? req.body.userId
              : res.json({
                  isError: true,
                  statuscode: 303,
                  details: null,
                  message: errorMsgJSON[lang]["303"] + " userId"
                });

              if (!req.body.parkId || !req.body.userId) { return; }


              //=======

              let aggrQuery = [
                  {
                      $match:
                          {
                              'parkId': parkId,
                          }
                  },
              ]

              Park.aggregate(aggrQuery,
                  function(err, response) {
                    if (err) {
                        res.json({
                          isError: true,
                          message: errorMsgJSON[lang]["404"],
                          statuscode: 404,
                          details: null
                        });

                        return;
                    }

                    if (response.length == 0) {
                        res.json({
                          isError: false,
                          message: 'Park Not Found',
                          statuscode: 404,
                          details: null
                        });

                        return;
                    }



              // ========== User.aggregate(aggrQuery,
                    let aggQuery = [
                        {
                            $match:
                                {
                                    'userId': userId,
                                }
                        },
                    ]

                    User.aggregate(aggQuery,
                        function(err, user) {

                          if (err) {
                              res.json({
                                isError: true,
                                message: errorMsgJSON[lang]["404"],
                                statuscode: 404,
                                details: null
                              });

                              return;
                          }

                          if (user.length == 0) {
                              res.json({
                                isError: false,
                                message: 'User Not Found',
                                statuscode: 404,
                                details: null
                              });

                              return;
                          }




              //  =========== Park.updateOne(updateWhere,

                                let updateWhere = {
                                      'parkId':parkId,
                                 }

                                Park.updateOne(updateWhere,
                                  {
                                      $pull: {"favouriteUser" : userId}
                                  },
                                    function (updatederror, updatedresponse) {

                                        if (updatederror) {
                                            res.json({
                                              isError: true,
                                              message: errorMsgJSON[lang]["404"],
                                              statuscode: 404,
                                              details: e
                                            });

                                            return;
                                        } else {

                                            if (updatedresponse.nModified == 1) {
                                              res.json({
                                                  isError: false,
                                                  message: errorMsgJSON[lang]["200"],
                                                  statuscode: 200,
                                                  details: null
                                              })

                                            } else {
                                                res.json({
                                                  isError: true,
                                                  message: errorMsgJSON[lang]["404"],
                                                  statuscode: 404,
                                                  details: e
                                                });
                                            }
                                        }
                                  }) // End Park.updateOne(updateWhere,
                                  //==========================
                  //  =========== Park.updateOne(updateWhere,
              })  // =========== User.aggregate(aggrQuery,

          }) //=========== Park.aggregate(aggrQuery,


          } catch (e) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 400,
            details: e
          });
        }

      },


      // This api used to fetch favourit park for particular user
      // made by Ankur on 14-01-20
      fetchFovouriteParkforUser: async (req, res, next) => {

          let lang = req.headers.language ? req.headers.language : "EN";
          try {

                  let page = req.body.pageno
                ? parseInt(req.body.pageno == 0 ? 0 : parseInt(req.body.pageno) - 1)
                : 0;
                 let perPage = req.body.perpage ? parseInt(req.body.perpage) : 10;

                // let searchTerm = req.body.city_name ? req.body.city_name: "";
                let zips = req.body.zips ? req.body.zips: [];

                let userId = req.body.userId
                    ? req.body.userId
                    : res.json({
                        isError: true,
                        statuscode: 303,
                        details: null,
                        message: errorMsgJSON[lang]["303"] + " userId"
                      });

                if (!req.body.userId || !req.body.zips) { return; }

                let agg ;

                agg = [

                      { "$match": {
                          "parkZipCode": { "$in": zips },
                         }
                      },

                      {
                        $project: {
                            "parkName": 1,
                            "parkDefaultPic": 1,
                            "parkRating": 1,
                            "parkId": 1,
                            "parkCoordinate": 1,
                            "isfavourite": 1
                        }
                      },

                      {
                        $group: {
                          _id: null,
                          total: {
                            $sum: 1
                          },
                          results: {
                            $push: "$$ROOT"
                          }
                        }
                      },
                      {
                        $project: {
                          _id: 0,
                          total: 1,
                          noofpage: {
                            $ceil: {
                              $divide: ["$total", perPage]
                            }
                          },
                          results: {
                            $slice: ["$results", page * perPage, perPage]
                          }
                        }
                      }
                  ];

                  // this function is used to check whether user exist or not
                  async function fetchPark(agg) {  // start of checkUse
                      return new Promise(function(resolve, reject){
                          Park.aggregate(agg).exec((err, park) => {

                            if (err) {
                                  resolve({"isError": true});
                            } else {

                                if (park.length > 0) {
                                    resolve({
                                      "isError": false,
                                      "parkExist": true,
                                      "parkList": park
                                    });
                                } else{
                                    resolve({
                                      "isError": false,
                                      "parkExist": false,
                                    });
                                }
                            }
                          });
                      }) // END return new Promise(function(resolve, reject){
                  } // start of fetchPark

                  let fetchParkStatus = await fetchPark(agg);

                  if (fetchParkStatus.isError == true) {
                      res.json({
                        isError: true,
                        message: errorMsgJSON[lang]["404"],
                        statuscode: 400,
                        details: e
                      });

                      return;
                  }

                  if (fetchParkStatus.parkExist == false) {
                      res.json({
                        isError: true,
                        message: errorMsgJSON[lang]["1033"],
                        statuscode: 404,
                        details: e
                      });

                      return;
                  }

                  let totalPark = fetchParkStatus.parkList[0].total;
                  let noofpage = fetchParkStatus.parkList[0].noofpage;
                  let ParkList = fetchParkStatus.parkList[0].results;

                  let i;
                  let favouriteUserList = [];

                  for (i = 0; i < ParkList.length; i++) {
                      favouriteUserList = ParkList[i].favouriteUser ? ParkList[i].favouriteUser : 'NA';

                      if (favouriteUserList.includes(userId)) {
                          ParkList[i].isfavourite = true;
                      } else {
                          ParkList[i].isfavourite = false;
                      }

                      delete ParkList[i].favouriteUser;
                  }

                  res.json({
                    isError: false,
                    message: errorMsgJSON[lang]["200"],
                    statuscode: 200,
                    details: {
                      totalPark: totalPark,
                      noofpage: noofpage,
                      ParkList: ParkList
                    }
                  });

          } catch (e) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 400,
            details: e
          });
        }

      },



      // This api used to make a park favourit for particular user
      // made by Ankur on 14-01-20
      makeFovouritePark: (req, res, next) => {
          let lang = req.headers.language ? req.headers.language : "EN";
          try {

              let parkId = req.body.parkId
              ? req.body.parkId
              : res.json({
                  isError: true,
                  statuscode: 303,
                  details: null,
                  message: errorMsgJSON[lang]["303"] + " parkId"
                });

              var userId = req.body.userId
              ? req.body.userId
              : res.json({
                  isError: true,
                  statuscode: 303,
                  details: null,
                  message: errorMsgJSON[lang]["303"] + " userId"
                });

               var usedAppleAuth = req.body.usedAppleAuth
              ? req.body.usedAppleAuth
              : false;

              if (!req.body.parkId || !req.body.userId) { return; }

              //=======

              let aggrQuery = [
                  {
                      $match:
                          {
                              'parkId': parkId,
                          }
                  },
              ]

              Park.aggregate(aggrQuery,
                  function(err, response) {
                    if (err) {
                        res.json({
                          isError: true,
                          message: errorMsgJSON[lang]["404"],
                          statuscode: 404,
                          details: null
                        });

                        return;
                    }

                    if (response.length == 0) {
                        res.json({
                          isError: false,
                          message: 'Park Not Found',
                          statuscode: 404,
                          details: null
                        });

                        return;
                    }



              // ========== User.aggregate(aggrQuery,
                    var aggQuery = [
                        {
                            $match:
                                {
                                    'userId': userId,
                                }
                        },
                    ]

                    if (usedAppleAuth == true) {
                        aggQuery = [
                        {
                            $match:
                                {
                                    'aUserId': userId,
                                }
                        },
                    ]
                    }

                    User.aggregate(aggQuery,
                        function(err, user) {

                          if (err) {
                              res.json({
                                isError: true,
                                message: errorMsgJSON[lang]["404"],
                                statuscode: 404,
                                details: null
                              });

                              return;
                          }

                          if (user.length == 0) {
                              res.json({
                                isError: false,
                                message: 'User Not Found',
                                statuscode: 404,
                                details: null
                              });

                              return;
                          }


                          //  =========== Park.updateOne(updateWhere,
                          let updateWhere = {
                                'parkId':parkId,
                           }

                          Park.updateOne(updateWhere,
                            {
                                $addToSet: {"favouriteUser" : userId}
                            },
                              function (updatederror, updatedresponse) {

                                  if (updatederror) {
                                      res.json({
                                        isError: true,
                                        message: errorMsgJSON[lang]["404"],
                                        statuscode: 404,
                                        details: e
                                      });

                                      return;
                                  } else {

                                      if (updatedresponse.nModified == 1) {
                                        res.json({
                                            isError: false,
                                            message: errorMsgJSON[lang]["200"],
                                            statuscode: 200,
                                            details: null
                                        })

                                      } else {
                                          res.json({
                                            isError: true,
                                            message: errorMsgJSON[lang]["404"],
                                            statuscode: 404,
                                            details: e
                                          });
                                      }
                                  }
                            }) // End Park.updateOne(updateWhere,
                            //  =========== Park.updateOne(updateWhere,
                      })  // =========== User.aggregate(aggrQuery,

                  }) //=========== Park.aggregate(aggrQuery,


          } catch (e) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 400,
            details: e
          });
        }

      },

      /**
       * @description :  // common sign-up process for any type of user (SUPER-ADMIN, CITY-ADMIN, USER)
       */
      signUp: (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        var name = req.body.name
          ? req.body.name
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " name"
            });
        var email = req.body.email
          ? req.body.email
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " email"
            });
         var mobile = req.body.mobile
          ? req.body.mobile
          : res.json({
              message: errorMsgJSON[lang]["303"] + "Please provide phone"
            });

          var appleAuth = req.body.usedAppleAuth
          ? req.body.usedAppleAuth
          : false;

          var password = "fakePassword";
          var aUserId = "";

          if (appleAuth == false) {
              password = req.body.password
          ? req.body.password
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " password"
            });
          } else {
              aUserId = req.body.aUserId
          ? req.body.aUserId
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " aUserId"
            });
          }

        var userType = req.body.user_type
          ? req.body.user_type
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " user_type"
            });

        var cityName = "";
        var cityId = "";

          // Try sign in first if using appleAuth

        if (appleAuth == true) {
              var findUserQry = {
                    aUserId: aUserId
                };

                User.findOne(findUserQry, function(err, item) {
                  if (item) {
                      res.json({
                                    isError: false,
                                    message: errorMsgJSON[lang]["200"],
                                    statuscode: 200,
                                    details: item
                                  });
                  } else {
                      // Do everything else
                      if (userType != "USER") {
        cityName = req.body.city_name
          ? req.body.city_name
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " city_name"
            });
        cityId = req.body.city_id
          ? req.body.city_id
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " city_id"
            });
        }

        // var userimage = req.body.userimage ? req.body.userimage : res.json({message : "Please provide userimage"});

        // Check whether the admin account is already added or not
        try {
          if (userType.toUpperCase() != "SUPER-ADMIN") {
              var newUser = new User({
              name: name,
              email: email,
              password: password,
              userType: userType.toUpperCase(),
              cityName: cityName,
              cityId: cityId
            });

              if (aUserId != "") {
                  newUser = new User({
              name: name,
              email: email,
              password: password,
              userType: userType.toUpperCase(),
              cityName: cityName,
              cityId: cityId,
              aUserId: aUserId
            });
              }


            newUser.save(function(err, item) {
              if (item) {
                res.json({
                  isError: false,
                  message: errorMsgJSON[lang]["202"],
                  statuscode: 200,
                  details: item
                });
              }
              if (err) {
                res.json({
                  isError: true,
                  message: errorMsgJSON[lang]["404"],
                  statuscode: 406,
                  details: err["message"]
                });
              }
            });
          } else {
            let findAdminQry = {
              userType: userType.toUpperCase()
            };

            User.find(findAdminQry, function(err, item) {
              if (err) {
                res.json({
                  isError: true,
                  message: errorMsgJSON[lang]["400"],
                  statuscode: 400,
                  details: null
                });
              } else {
                // If User not present
                if (item.length == 0) {
                  var newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                    userType: userType.toUpperCase(),
                    cityName: cityName,
                    cityId: cityId
                  });

                  newUser.save(function(err, item) {
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
                        details: err["message"]
                      });
                    }
                  });
                } else {
                  res.json({
                    isError: true,
                    message: "SUPER-ADMIN already exists",
                    statuscode: 503,
                    details: null
                  });
                }
              }
            });
          }
        } catch (e) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 400,
            details: e
          });
        }
                  }
                });

          } else {
              // Do everything else
                      if (userType != "USER") {
        cityName = req.body.city_name
          ? req.body.city_name
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " city_name"
            });
        cityId = req.body.city_id
          ? req.body.city_id
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " city_id"
            });
        }

        // var userimage = req.body.userimage ? req.body.userimage : res.json({message : "Please provide userimage"});

        // Check whether the admin account is already added or not
        try {
          if (userType.toUpperCase() != "SUPER-ADMIN") {
              var newUser = new User({
              name: name,
              email: email,
              mobile: mobile,
              password: password,
              userType: userType.toUpperCase(),
              cityName: cityName,
              cityId: cityId
            });

              if (aUserId != "") {
                  newUser = new User({
              name: name,
              email: email,
              mobile: mobile,
              password: password,
              userType: userType.toUpperCase(),
              cityName: cityName,
              cityId: cityId,
              aUserId: aUserId
            });
              }


            newUser.save(function(err, item) {
              if (item) {
                res.json({
                  isError: false,
                  message: errorMsgJSON[lang]["202"],
                  statuscode: 200,
                  details: item
                });
              }
              if (err) {
                res.json({
                  isError: true,
                  message: errorMsgJSON[lang]["404"],
                  statuscode: 406,
                  details: err["message"]
                });
              }
            });
          } else {
            let findAdminQry = {
              userType: userType.toUpperCase()
            };

            User.find(findAdminQry, function(err, item) {
              if (err) {
                res.json({
                  isError: true,
                  message: errorMsgJSON[lang]["400"],
                  statuscode: 400,
                  details: null
                });
              } else {
                // If User not present
                if (item.length == 0) {
                  var newUser = new User({
                    name: name,
                    email: email,
                    mobile: mobile,
                    password: password,
                    userType: userType.toUpperCase(),
                    cityName: cityName,
                    cityId: cityId
                  });

                  newUser.save(function(err, item) {
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
                        details: err["message"]
                      });
                    }
                  });
                } else {
                  res.json({
                    isError: true,
                    message: "SUPER-ADMIN already exists",
                    statuscode: 503,
                    details: null
                  });
                }
              }
            });
          }
        } catch (e) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 400,
            details: e
          });
        }
          }


      },

      /**
       * @description :  sign in process using email and password
       */
      signIn: (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
          var appleAuth = req.body.usedAppleAuth
          ? req.body.usedAppleAuth
          : false;

        var email = req.body.email
          ? req.body.email
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + "Please provide email"
            });

          var password = "";

          if (appleAuth == false) {
              password = req.body.password
          ? req.body.password
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + "Please provide password"
            });
          }

        var findUserQry = {
          email: email
        };

          if (appleAuth == true) {
              findUserQry = {
                  aUserId: email
                };
          }

        User.findOne(findUserQry, function(err, item) {
          if (err) {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["400"],
              statuscode: 400,
              details: null
            });
          } else {
            if (!item) {
              res.json({
                isError: true,
                message: errorMsgJSON[lang]["400"],
                statuscode: 400,
                details: null
              });
            } else {
                if (appleAuth == true) {
                    res.json({
                            isError: false,
                            message: errorMsgJSON[lang]["200"],
                            statuscode: 200,
                            details: {
                              token: "JWT",
                              data: item
                            }
                          });
                }
              item.comparePassword(password, async function(err, isMatch) {
                console.log(isMatch);
                if (isMatch && !err) {
                  try {
                    user = JSON.parse(JSON.stringify(item));
                    delete user.password;
                    var token = await jwt.sign(user, config.secret.d, {
                      expiresIn: "12h"
                    });

                    //Update user isLoggedIn status to true

                    User.updateOne(
                      findUserQry,
                      {
                        isLoggedIn: true
                      },
                      function(err, item) {
                        if (err) {
                          res.json({
                            isError: true,
                            message: errorMsgJSON[lang]["400"],
                            statuscode: 400,
                            details: null
                          });
                        } else {
                          res.json({
                            isError: false,
                            message: errorMsgJSON[lang]["200"],
                            statuscode: 200,
                            details: {
                              token: "JWT " + token,
                              data: user
                            }
                          });
                        }
                      }
                    );
                  } catch (error) {
                    return res.json({
                      isError: true,
                      message: "Auth failed." + JSON.stringify(error),
                      statuscode: 400,
                      data: null
                    });
                  }
                } else {
                  return res.json({
                    isError: true,
                    message: "Auth failed.",
                    statuscode: 400,
                    data: []
                  });
                }
              });
            }
          }
        });
      },

      /**
       * @description :   forget password feature, will send email to registered email with OTP
       */
      forgotPassword: (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        let email = req.body.email
          ? req.body.email
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " - email "
            });
        let query = { email: email };
        User.findOne(query, function(err, item) {
          if (err) {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["400"],
              statuscode: 440,
              details: null
            });
          } else {
            if (item.length == 0) {
              res.json({
                isError: true,
                message: errorMsgJSON[lang]["400"],
                statuscode: 401,
                details: null
              });
            } else {
              let randomNumber =
                Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
              var otpMailDetails = {
                receiver: email,
                subject: "OTP",
                message: "Hi, Your OTP for the verification is " + randomNumber
              };
              Mailercontroller.viaGmail(otpMailDetails, (err, data) => {
                if (err) {
                  res.json({
                    isError: true,
                    message: errorMsgJSON[lang]["400"],
                    statuscode: 430,
                    details: null
                  });
                } else {
                  var updatevalueswith = {
                    $set: {
                      otp: randomNumber
                    }
                  };
                  User.updateOne(query, updatevalueswith, function(err, res1) {
                    if (err) {
                      res.json({
                        isError: true,
                        message: errorMsgJSON[lang]["400"],
                        statuscode: 400,
                        details: null
                      });
                    }
                    if (res1.nModified > 0) {
                      res.json({
                        isError: false,
                        message: errorMsgJSON[lang]["203"],
                        statuscode: 200,
                        details: data
                      });
                    }
                  });
                }
              });
            }
          }
        });
      },

      /**
       * @description :   reset password feature, if OTP matches for the user then update password
       */
      resetPassword: async (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        let email = req.body.email
          ? req.body.email
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " - Email "
            });
        let otp = req.body.otp
          ? req.body.otp
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " - otp "
            });
        let newPassword = req.body.new_password
          ? req.body.new_password
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + " - New Password "
            });

        var salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        let hashedNewpassword = await bcrypt.hash(newPassword, salt);

        let query = { email: email };

        User.find(query, function(err, item) {
          if (err) {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["400"],
              statuscode: 400,
              details: null
            });
          } else {
            if (item.length == 0) {
              res.json({
                isError: true,
                message: errorMsgJSON[lang]["503"],
                statuscode: 503,
                details: null
              });
            } else {
              if (item[0].otp.toString().trim() === otp.toString().trim()) {
                var updatevalueswith = {
                  $set: {
                    password: hashedNewpassword
                  }
                };
                User.updateOne(query, updatevalueswith, function(err, res1) {
                  if (err) {
                    res.json({
                      isError: true,
                      message: errorMsgJSON[lang]["400"],
                      statuscode: 400,
                      details: null
                    });
                  }
                  if (res1.nModified > 0) {
                    res.json({
                      isError: false,
                      message:
                        errorMsgJSON[lang]["200"] +
                        " Password Changed Successfully",
                      statuscode: 200,
                      details: null
                    });
                  }
                });
              } else {
                res.json({
                  isError: true,
                  message: errorMsgJSON[lang]["503"],
                  statuscode: 503,
                  details: null
                });
              }
            }
          }
        });
      },

      /**
       * @description : sign out functionality
       */

      signOut: (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        var email = req.body.email
          ? req.body.email
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + "Please provide email"
            });

        let findUserQry = {
          email: email
        };

        User.updateOne(
          findUserQry,
          {
            isLoggedIn: false
          },
          function(err, item) {
            if (err) {
              res.json({
                isError: true,
                message: errorMsgJSON[lang]["400"],
                statuscode: 400,
                details: null
              });
            } else {
              res.json({
                isError: false,
                message: errorMsgJSON[lang]["200"],
                statuscode: 200,
                details: null
              });
            }
          }
        );
      },

      /** ******************************* AUTH-RELATED FEATURES __end ******************************** */

      /** ******************************* ACTIVITY-RELATED FEATURES start__******************************** */

      /**
       * @description : Get list of parks based on location or zipcode
       */
      getParkList: (req, res, next) => {
    let lang = req.headers.language ? req.headers.language : "EN";
    var cityState = req.body.city_state
      ? req.body.city_state
      : res.json({
          isError: true,
          statuscode: 303,
          details: null,
          message: errorMsgJSON[lang]["303"] + "Please provide city_state"
        });
    // var pageNo = req.body.page_no ? req.body.page_no : 1;
    // var perPageItem = req.body.per_page_item ? req.body.per_page_item : 10;
    // var itemToSkip = (pageNo - 1) * perPageItem;



      parkListProjectQry = [
        {
          $match: {
            parkCity: cityState
          }
        },
        {
          $project: {
            _id: 0,
            parkRating: 1,
            isParkVerified: 1,
            isRemoved: 1,
            parkDefaultPic: 1,
            parkName: 1,
            parkCity: 1,
            parkCoordinate: 1,
            parkId: 1,
            favouriteUser: 1,
            parkReviewCount: 1
          }
        }
      ]



          Park.aggregate(parkListProjectQry).exec((err, item) => {

              if (err) {
                  res.json({
                    isError: true,
                    message: errorMsgJSON[lang]["404"],
                    statuscode: 404,
                    details: err
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

      // This api is used to get all the list of cities for Normal Application
      //======================================================================
      getCityList: (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        try{
          var searchTerm = req.body.searchTerm ? req.body.searchTerm : "";

          let agg = [
                {
                  $match: {
                    cityDisplayName: { $regex: searchTerm, $options: "g" }
                    //cityDisplayName: { $regex: searchTerm, $options: "i" }
                  }
                },

                {
                  $project: {
                    _id: 0,
                    cityDisplayName:1,
                    cityId:1,
                    zips:1
                  }
                },



          ]

          city.aggregate(agg).exec((err, item) => {
            console.log(item)
            res.json({
              isError: false,
              message: errorMsgJSON[lang]["200"],
              statuscode: 200,
              details: item
            });
          });



        }
        catch (error) {
          console.log("error", error);
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 404,
            details: error
          });
        }
      },

      //============================================================================
      // this api is written to fetch the list of cities for mobile application
      getCityListForMobApp: (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        try{
          var searchTerm = req.body.searchTerm ? req.body.searchTerm : "";

          let pageNo = req.body.pageNo ? (parseInt(req.body.pageNo == 0 ? 0 : parseInt(req.body.pageNo) - 1)) : 0;
          let perPage = req.body.perPage ? parseInt(req.body.perPage) : 70;

          let agg = [
                {
                  $match: {
                      cityDisplayName: { $regex: searchTerm, $options: "i" }
                  }
                },

                {
                  $project: {
                    _id: 0,
                    cityDisplayName:1,
                    cityId:1,
                    zips:1
                  }
                },

                {
                    $group: {
                        _id: null,
                        total: {
                        $sum: 1
                        },
                        results: {
                        $push : '$$ROOT'
                        }
                    }
                },

                {
                    $project : {
                        '_id': 0,
                        'total': 1,
                        'noofpage': { $ceil :{ $divide: [ "$total", perPage ] } },
                        'results': {
                            $slice: [
                                '$results', pageNo * perPage , perPage
                            ]
                        }
                    }
                }

          ]

          city.aggregate(agg).exec((err, item) => {

            res.json({
              isError: false,
              message: errorMsgJSON[lang]["200"],
              statuscode: 200,
              details: item
            });
          });



        }
        catch (error) {
          console.log("error", error);
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 404,
            details: error
          });
        }
      },


      //============================================================================
      fetchParkList: (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        try{
          let page = req.body.pageno
          ? parseInt(req.body.pageno == 0 ? 0 : parseInt(req.body.pageno) - 1)
          : 0;
           let perPage = req.body.perpage ? parseInt(req.body.perpage) : 10;
         // let searchTerm = req.body.city_name ? req.body.city_name: "";
          let zips = req.body.zips ? req.body.zips: [];

          let agg ;

            agg = [
              // {
              //   $match: {
              //     parkCity: searchTerm
              //   }
              // },
              { "$match": {
                "parkZipCode": { "$in": zips },

            } },

              {
                $group: {
                  _id: null,
                  total: {
                    $sum: 1
                  },
                  results: {
                    $push: "$$ROOT"
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  total: 1,
                  noofpage: {
                    $ceil: {
                      $divide: ["$total", perPage]
                    }
                  },
                  results: {
                    $slice: ["$results", page * perPage, perPage]
                  }
                }
              }
            ];

          console.log(agg)

          Park.aggregate(agg).exec((err, item) => {
            console.log(item)
            res.json({
              isError: false,
              message: errorMsgJSON[lang]["200"],
              statuscode: 200,
              details: item
            });
          });


        }
        catch (error) {
          console.log("error", error);
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 404,
            details: error
          });
        }


      },

      getCityZipParkList: async (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        try {
          let page = req.body.pageno
            ? parseInt(req.body.pageno == 0 ? 0 : parseInt(req.body.pageno) - 1)
            : 0;
          let perPage = req.body.perpage ? parseInt(req.body.perpage) : 10;
          var searchRadius = req.body.search_radius ? req.body.search_radius : 5;
          var currentLat = req.body.current_lat
            ? req.body.current_lat
            : res.json({
                isError: true,
                statuscode: 303,
                details: null,
                message: errorMsgJSON[lang]["303"] + "Please provide current_lat"
              });
          var currentLong = req.body.current_long
            ? req.body.current_long
            : res.json({
                isError: true,
                statuscode: 303,
                details: null,
                message: errorMsgJSON[lang]["303"] + "Please provide current_long"
              });
          var searchTerm = req.body.zip_code ? req.body.zip_code : "";
          let distanceInMeter = searchRadius * 1000;
          if (!req.body.current_lat || !req.body.current_long) {
            return;
          }

          if (searchTerm == "") {
            let returnJson = await getLocationWiseParkList(
              page,
              perPage,
              distanceInMeter,
              currentLat,
              currentLong
            );
            if (returnJson == "1") {
              res.json({
                isError: true,
                message: errorMsgJSON[lang]["404"],
                statuscode: 400,
                details: null
              });
            } else if (returnJson == "2") {
              res.json({
                isError: false,
                message: errorMsgJSON[lang]["1076"],
                statuscode: 1076,
                details: []
              });
            } else {
              res.json({
                isError: false,
                message: errorMsgJSON[lang]["200"],
                statuscode: 200,
                details: returnJson[0]
              });
            }
          } else {
            console.log(2);
            let searchAggrQry = [

              // {
              //   $match: {
              //     isRemoved: false
              //   }
              // },
              // {
              //   $unwind: "$zips"
              // },
              // {
              //   $match: {
              //     zips: searchTerm
              //   }
              // },
              // {
              //   $project: {
              //     _id: 0,
              //     zips: 1,
              //     cityName:1
              //   }
              // }
              // {
              //   $match:{
              //     $or : [
              //       {parkZipCode: searchTerm},
              //       {parkCity: searchTerm}
              //     ]
              //   }
              // }






              {
                $match: {
                  $or: [
                    {parkName:  searchTerm},
                    {parkZipCode: searchTerm}
                  ]
                }
              },
              // {
              //   $project: {
              //     parkCity: 1
              //   }
              // },
              {
                $match: {
                  parkCity: "$parkCity"
                }
              }
              // {
              //   $project: {
              //     "field": {
              //       $cond: [
              //         {
              //           $eq: [
              //             "$parkName", searchTerm
              //           ]
              //         },
              //         "$$ROOT",
              //         "$parkCity"
              //       ]
              //     }
              //   }
              // },

              // { $match: {  } }

              // {
              //   $project: {
              //     field: {
              //       $switch: {
              //          branches: [
              //             { case: {
              //                 $eq: [
              //                   "$parkName", searchTerm
              //                 ]
              //               }, then: "$$ROOT" },
              //             { case: {$ne: [
              //               "$parkName", searchTerm
              //             ]}, then:
              //               "$parkCity"
              //              }
              //          ],
              //          default: "Did not match"
              //       }
              //    },
              //    parkCity:1,
              //    parkZipCode: 1

              //   }
              // },
              // {
              //   $group: {
              //     _id: "$field",
              //     fields: {$first: "$field"},
              //     parkCity:{$first: "$parkCity"},
              //     parkZipCode: {$first: "$parkZipCode"}
              //   }
              // },
              // {
              //   $project: {
              //     parkCity:1,
              //     parkZipCode: 1
              //   }
              // },
              // {
              //   $match: {
              //     parkCity: "$parkCity"
              //   }
              // }
            ];

            Park.aggregate(searchAggrQry).exec((err, item) => {
              console.log(item);
              console.log(err);
              res.json({
                item: item,
                err: err
              });
            });
          }

          // let returnJson = await getCityWiseParkList(
          //   page,
          //   perPage,
          //   distanceInMeter,
          //   currentLat,
          //   currentLong,
          //   searchTerm
          // );
          // res.json({
          //   returnJson:returnJson
          // })
        } catch (error) {
          console.log("error", error);
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 404,
            details: error
          });
        }
      },
      getCityParkList: (req, res, next) => {
        try {
          let lang = req.headers.language ? req.headers.language : "EN";
          let page = req.body.pageno
            ? parseInt(req.body.pageno == 0 ? 0 : parseInt(req.body.pageno) - 1)
            : 0;
          let perPage = req.body.perpage ? parseInt(req.body.perpage) : 10;
          var searchRadius = req.body.search_radius ? req.body.search_radius : 5;
          var currentLat = req.body.current_lat
            ? req.body.current_lat
            : res.json({
                isError: true,
                statuscode: 303,
                details: null,
                message: errorMsgJSON[lang]["303"] + "Please provide current_lat"
              });
          var currentLong = req.body.current_long
            ? req.body.current_long
            : res.json({
                isError: true,
                statuscode: 303,
                details: null,
                message: errorMsgJSON[lang]["303"] + "Please provide current_long"
              });
          var searchTerm = req.body.zip_code ? req.body.zip_code : "";
          let distanceInMeter = searchRadius * 1000;
          if (!req.body.current_lat || !req.body.current_long) {
            return;
          }
          searchAggrQry =
            searchTerm == ""
              ? [
                  {
                    $geoNear: {
                      near: {
                        type: "Point",
                        coordinates: [
                          parseFloat(currentLong),
                          parseFloat(currentLat)
                        ]
                      },
                      distanceField: "locationDistance",
                      maxDistance: parseInt(distanceInMeter),
                      spherical: true
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
                      _id: null,
                      total: {
                        $sum: 1
                      },
                      results: {
                        $push: "$$ROOT"
                      }
                    }
                  },
                  {
                    $project: {
                      _id: 0,
                      total: 1,
                      noofpage: {
                        $ceil: {
                          $divide: ["$total", perPage]
                        }
                      },
                      results: {
                        $slice: ["$results", page * perPage, perPage]
                      }
                    }
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
                      _id: {
                        parkZipCode: "$parkZipCode"
                      },
                      parkCity: {
                        $first: "$parkCity"
                      },
                      parkName: {
                        $first: "$parkName"
                      },
                      parkZipCode: {
                        $first: "$parkZipCode"
                      }
                    }
                  },
                  {
                    $project: {
                      _id: 0,
                      parkCity: 1,
                      parkName: 1,
                      parkZipCode: 1
                    }
                  }
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
              if (item.length == 0) {
                res.json({
                  isError: false,
                  message: errorMsgJSON[lang]["1076"],
                  statuscode: 1076,
                  details: []
                });
              } else {
                if (searchTerm == item[0].parkName) {
                  let agg = [
                    {
                      $match: {
                        parkName: item[0].parkName
                      }
                    },
                    {
                      $group: {
                        _id: null,
                        total: {
                          $sum: 1
                        },
                        results: {
                          $push: "$$ROOT"
                        }
                      }
                    },
                    {
                      $project: {
                        _id: 0,
                        total: 1,
                        noofpage: {
                          $ceil: {
                            $divide: ["$total", perPage]
                          }
                        },
                        results: {
                          $slice: ["$results", page * perPage, perPage]
                        }
                      }
                    }
                  ];
                  Park.aggregate(agg).exec((err, item) => {
                    res.json({
                      isError: false,
                      message: errorMsgJSON[lang]["200"],
                      statuscode: 200,
                      details: item
                    });
                  });
                } else if (searchTerm == item[0].parkZipCode) {
                  let agg = [
                    {
                      $match: {
                        parkCity: item[0].parkCity
                      }
                    },
                    {
                      $group: {
                        _id: null,
                        total: {
                          $sum: 1
                        },
                        results: {
                          $push: "$$ROOT"
                        }
                      }
                    },
                    {
                      $project: {
                        _id: 0,
                        total: 1,
                        noofpage: {
                          $ceil: {
                            $divide: ["$total", perPage]
                          }
                        },
                        results: {
                          $slice: ["$results", page * perPage, perPage]
                        }
                      }
                    }
                  ];
                  Park.aggregate(agg).exec((err, item) => {
                    res.json({
                      isError: false,
                      message: errorMsgJSON[lang]["200"],
                      statuscode: 200,
                      details: item
                    });
                  });
                } else {
                  searchAggrQry =
                    searchTerm == ""
                      ? [
                          {
                            $geoNear: {
                              near: {
                                type: "Point",
                                coordinates: [
                                  parseFloat(currentLong),
                                  parseFloat(currentLat)
                                ]
                              },
                              distanceField: "locationDistance",
                              maxDistance: parseInt(distanceInMeter),
                              spherical: true
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
                              _id: null,
                              total: {
                                $sum: 1
                              },
                              results: {
                                $push: "$$ROOT"
                              }
                            }
                          },
                          {
                            $project: {
                              _id: 0,
                              total: 1,
                              noofpage: {
                                $ceil: {
                                  $divide: ["$total", perPage]
                                }
                              },
                              results: {
                                $slice: ["$results", page * perPage, perPage]
                              }
                            }
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
                                      parkName: {
                                        $regex: searchTerm,
                                        $options: "g"
                                      }
                                    },
                                    {
                                      parkZipCode: {
                                        $regex: searchTerm,
                                        $options: "g"
                                      }
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
                              _id: null,
                              total: {
                                $sum: 1
                              },
                              results: {
                                $push: "$$ROOT"
                              }
                            }
                          },
                          {
                            $project: {
                              _id: 0,
                              total: 1,
                              noofpage: {
                                $ceil: {
                                  $divide: ["$total", perPage]
                                }
                              },
                              results: {
                                $slice: ["$results", page * perPage, perPage]
                              }
                            }
                          }
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
                      if (item.length == 0) {
                        res.json({
                          isError: false,
                          message: errorMsgJSON[lang]["1076"],
                          statuscode: 1076,
                          details: []
                        });
                      } else {
                        res.json({
                          isError: false,
                          message: errorMsgJSON[lang]["200"],
                          statuscode: 200,
                          details: item
                        });
                      }
                    }
                  });
                }
              }
            }
          });
        } catch (error) {
          res.json({
            isError: true,
            message: errorMsgJSON[lang]["404"],
            statuscode: 404,
            details: null
          });
        }
      },

      // create filter api to get sidebar filter lists

      /**
       * @description : Apply filters to facilitate faceted search to find appropriate park
       */
      getFilter: (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        // var operationType = req.body.operation_type
        //   ? req.body.operation_type
        //   : res.json({
        //       isError: true,
        //       statuscode: 303,
        //       details: null,
        //       message: errorMsgJSON[lang]["303"] + "Please provide operation_type"
        //     });

        // Get amenity list
        let amenityAggr = [
          {
            $project: {
              _id: 0,
              amenityId: 1,
              amenityName: 1
            }
          }
        ];

        Amenity.aggregate(amenityAggr).exec((err, res1) => {
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
              message: errorMsgJSON[lang]["200"],
              statuscode: 200,
              details: res1
            });
          }
        });
      },

      /**
       * @description : Apply filters to facilitate faceted search to find appropriate park
       */
      applyFilter: (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        var operationType = req.body.operation_type
          ? req.body.operation_type
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + "Please provide operation_type"
            });
      },

      /**
       * @description : get details of a park
       */
      getParkDetail: (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        var parkId = req.body.park_id
          ? req.body.park_id
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + "Please provide park_id"
            });

        if (!req.body.park_id) { return; }

        var findParkById = {
          parkId: parkId
        };

        Park.find(findParkById, function(err, parkdetails) {
          if (err) {
            res.json({
              isError: true,
              message: errorMsgJSON[lang]["404"],
              statuscode: 400,
              details: err
            });
          } else {
              let cityState = parkdetails[0]["parkCity"];

              var reviewQ = [
                  {
                      $match:
                          {
                              'parkId': parkId
                          }
                  },
              ]

              var contestQ = [
                      {
                          $match:
                              {
                                  'parkCity': cityState,
                                  'isEnabled': true
                              }
                      },
                    ]

                Review.aggregate(reviewQ).exec((errR, itemR) => {
                  if (errR) {
                      // Check for contests
                      Contest.aggregate(contestQ).exec((errC1, itemC1) => {
                          if (errC1) {
                              res.json({
                                      isError: false,
                                      message: errorMsgJSON[lang]["200"],
                                      statuscode: 200,
                                      details: parkdetails
                                  });
                          } else {
                              if (itemC1.length > 0) {
                                  res.json({
                                      isError: false,
                                      message: errorMsgJSON[lang]["200"],
                                      statuscode: 200,
                                      details: parkdetails,
                                      contests: itemC1
                                  });
                              } else {
                                  res.json({
                                      isError: false,
                                      message: errorMsgJSON[lang]["200"],
                                      statuscode: 200,
                                      details: parkdetails
                                  });
                              }

                          }
                        });
                  } else {
                      // We have reviews
                      // Check for contests
                      Contest.aggregate(contestQ).exec((cError, cRes) => {
                          if (cError) {
                              res.json({
                                      isError: false,
                                      message: errorMsgJSON[lang]["200"],
                                      statuscode: 200,
                                      details: parkdetails,
                                      reviews: itemR
                                  });
                          } else {
                              if (cRes.length > 0) {
                                  res.json({
                                      isError: false,
                                      message: errorMsgJSON[lang]["200"],
                                      statuscode: 200,
                                      details: parkdetails,
                                      contests: cRes,
                                      reviews: itemR
                                  });
                              } else {
                                  res.json({
                                      isError: false,
                                      message: errorMsgJSON[lang]["200"],
                                      statuscode: 200,
                                      details: parkdetails,
                                      reviews: itemR
                                  });
                              }
                          }
                        });
                  }
            });
          }
            });
      },

      /**
       * @description : provide rating and review to a particular park
       */
      giveParkReview: (req, res, next) => {
        let lang = req.headers.language ? req.headers.language : "EN";
        var parkId = req.body.park_id
          ? req.body.park_id
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + "Please provide park_id"
            });
        var userId = req.body.user_id
          ? req.body.user_id
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + "Please provide user_id"
            });
        var ratingValue = req.body.rating_value
          ? req.body.rating_value
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + "Please provide rating_value"
            });
        var reviewText = req.body.review_text
          ? req.body.review_text
          : res.json({
              isError: true,
              statuscode: 303,
              details: null,
              message: errorMsgJSON[lang]["303"] + "Please provide review_text"
            });
    //    var photos = req.body.photos
    //      ? req.body.photos
    //      : res.json({
    //          isError: true,
    //          statuscode: 303,
    //          details: null,
    //          message: errorMsgJSON[lang]["303"] + "Please provide photos"
    //        });

        let newReview = new Review({
          parkId: parkId,
          userId: userId,
          ratingValue: ratingValue,
          reviewText: reviewText
          //photos: JSON.parse(photos)
        });

        newReview.save(function(err, response) {
          if (response) {
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

      /** ******************************* ACTIVITY-RELATED FEATURES __end ******************************** */
    };
    function getCityWiseParkList(
      page,
      perPage,
      distanceInMeter,
      currentLat,
      currentLong,
      searchTerm
    ) {
      return new Promise(function(resolve, reject) {
        let searchAggrQry = [{ $match: { searchTerm: { $in: zips } } }];

        city.aggregate(searchAggrQry).exec((err, item) => {
          if (err) {
            reject("1");
          } else {
            if (item.length == 0) {
              reject("2");
            } else {
              resolve(item);
            }
          }
        });
      });
    }
    function getLocationWiseParkList(
      page,
      perPage,
      distanceInMeter,
      currentLat,
      currentLong
    ) {
      return new Promise(function(resolve, reject) {
        let searchAggrQry = [
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [parseFloat(currentLong), parseFloat(currentLat)]
              },
              distanceField: "locationDistance",
              maxDistance: parseInt(distanceInMeter),
              spherical: true
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
              _id: null,
              total: {
                $sum: 1
              },
              results: {
                $push: "$$ROOT"
              }
            }
          },
          {
            $project: {
              _id: 0,
              total: 1,
              noofpage: {
                $ceil: {
                  $divide: ["$total", perPage]
                }
              },
              results: {
                $slice: ["$results", page * perPage, perPage]
              }
            }
          }
        ];
        Park.aggregate(searchAggrQry).exec((err, item) => {
          if (err) {
            reject("1");
          } else {
            if (item.length == 0) {
              reject("2");
            } else {
              resolve(item);
            }
          }
        });
      });
    }
