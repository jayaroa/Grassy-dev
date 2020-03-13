const mongoose = require('mongoose');

const parkvisitSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    userId : String,
    parkId : String,
    noOfVisits : {
        type : Number,
        default : 1
    },
    parkVisitDates : [],    
},
{
    timestamps: true, // add created_at , updated_at at the time of insert/update
    versionKey: false 
})



const ParkVisit = mongoose.model("ParkVisit", parkvisitSchema)

module.exports = ParkVisit




