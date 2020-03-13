const mongoose = require('mongoose');
const autoId = require('../../../services/AutogenerateId');


const reviewSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    reviewId : {
        type : String
    },
    given_at : { 
        type: Date,
        default: Date.now
    },
    rating : {
        type : Number,
        // enum : [1,2,3,4,5],
        default : 0
    },
    parkId : String,
    userId : String,
    cityState : String,
    reviewerName:String,
    cars:Number,
    people:Number,
    message : {
        type : String
    },
    photos : []
},
{
    timestamps: true, // add created_at , updated_at at the time of insert/update
    versionKey: false 
})

reviewSchema.pre('save', async function (next) {
    var review = this;
    if (this.isNew) {
        try {            
            review._id = new mongoose.Types.ObjectId();
            review.reviewId = await autoId.autogenerateId('REV');
            return next();
        } catch (error) {
            return next(error);
        }

    } else {
        return next();
    }
})


const Review = mongoose.model("Review", reviewSchema)

module.exports = Review




