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

const contestSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    contestId : {
        type : String
    },
    sponsorName : String,
    awardAmount : { 
        type: String        
    },
    startDate : {
        type: String
    },   
    endDate : String,
    isEnabled: {
        type : Boolean,
        default : false
    },
    sponsorLogo : String,
    parkCity : String,
    mysteryPicture : String,
    contestType : String,
    contestDetails : String,
    supportEmail : String
},
{
    timestamps: true, // add created_at , updated_at at the time of insert/update
    versionKey: false 
})

contestSchema.pre('save', async function (next) {
    var contest = this;
    if (this.isNew) {
        try {            
            contest._id = new mongoose.Types.ObjectId();
            contest.contestId = await autoId.autogenerateId('CON');
            return next();
        } catch (error) {
            return next(error);
        }

    } else {
        return next();
    }
})


const Contest = mongoose.model("Contest", contestSchema)

module.exports = Contest




