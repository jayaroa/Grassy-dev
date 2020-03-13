const mongoose = require('mongoose');
const autoId = require('../../../services/AutogenerateId');


const amenitySchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    amenityId : {
        type : String
    },
    amenityName : { 
        type : String
    },
    isRemoved :{
        type: Boolean,
        default : false
    }
},
{
    timestamps: true, // add created_at , updated_at at the time of insert/update
    versionKey: false 
})

amenitySchema.pre('save', async function (next) {
    var amenity = this;
    if (this.isNew) {
        try {            
            amenity._id = new mongoose.Types.ObjectId();
            amenity.amenityId = await autoId.autogenerateId('AME');
            return next();
        } catch (error) {
            return next(error);
        }

    } else {
        return next();
    }
})


const Amenity = mongoose.model("Amenity", amenitySchema)

module.exports = Amenity