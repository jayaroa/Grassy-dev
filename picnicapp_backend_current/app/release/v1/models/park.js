const mongoose = require('mongoose');
const autoId = require('../../../services/AutogenerateId');


const pointSchema =  new mongoose.Schema({
    type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        // required: true
      },
      coordinates: {
        type: [Number],
        // required: true
      }
},{
  _id : false
});

const parkSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    parkId : {
        type : String
    },
    parkName : String,
    // parkMobile : { 
    //     type: String,
    //     get : v => parseInt(v),
    //     trim: true,
    //     match : [/^(\+\d{1,3}[- ]?)?\d{10}$/,'Please fill valid mobile number'],
    //     validate: {
    //         validator: function() {
    //           return new Promise((res, rej) =>{
    //             Park.findOne({parkMobile: this.parkMobile,_id: {$ne: this._id}})
    //                 .then(data => {
    //                     if(data) {
    //                         res(false)
    //                     } else {
    //                         res(true)
    //                     }
    //                 })
    //                 .catch(err => {
    //                     res(false)
    //                 })
    //           })
    //         }, message: 'Mobile Already Taken'
    //       } 
    // },
    parkMobile : { 
        type: String        
    },
    parkEmail : {
        type: String, 
        lowercase: true,
    },   
    parkAddress : String,
    parkZipCode : String,
    parkCity : String,
    parkMessage : String,
    parkCityId : String,
    parkAcreage : Number,
    parkReviewCount :{
        type : Number,
        default : 0
    },
    parkCoordinate : pointSchema,
    parkRating :{
        type : Number,
        default : 0
    },
    activeContestCount :{
        type : Number,
        default : 0
    },
    isParkVerified: {
        type : Boolean,
        default : false
    },
    isRemoved :{
        type: Boolean,
        default : false
    },
    parkDefaultPic : {
        type :String,
        default : "https://via.placeholder.com/550x390?text=No+park+image+found"
    },
    parkPictures : [],
    parkLatestReviews : [],
    parkAmenities : [],
    parkDetails : [],
    pavilions : [],
    fields : [],
    //==========================
    // favourids User
    favouriteUser: [],
    //==========================
    lastUpdatedBy : String,
    editedBy : []               // holds the list of Ids who edited the details 
},
{
    timestamps: true, // add created_at , updated_at at the time of insert/update
    versionKey: false 
})

parkSchema.pre('save', async function (next) {
    var park = this;
    if (this.isNew) {
        try {            
            park._id = new mongoose.Types.ObjectId();
            park.parkId = await autoId.autogenerateId('PRK');
            return next();
        } catch (error) {
            return next(error);
        }

    } else {
        return next();
    }
})


const Park = mongoose.model("Park", parkSchema)

module.exports = Park




