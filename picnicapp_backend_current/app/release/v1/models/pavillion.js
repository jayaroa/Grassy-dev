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

const pavilionSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    pavilionId : {
        type : String
    },
    pavilionName : String,
    parkId : String,
    pavilionCoordinate : pointSchema,
    isReservable: {
        type : Boolean,
        default : false
    },
    pavilionDefaultPic : String,
    pavilionReservationUrl : String,    
    pavilionAmenities : [],
    lastUpdatedBy : String,
    editedBy : []             // holds the list of Ids who edited the details 
},
{
    timestamps: true, // add created_at , updated_at at the time of insert/update
    versionKey: false 
})

pavilionSchema.pre('save', async function (next) {
    var pavilion = this;
    if (this.isNew) {
        try {            
            pavilion._id = new mongoose.Types.ObjectId();
            pavilion.pavilionId = await autoId.autogenerateId('PAV');
            return next();
        } catch (error) {
            return next(error);
        }

    } else {
        return next();
    }
})

const Pavilion = mongoose.model("Pavilion", pavilionSchema)

module.exports = Pavilion




