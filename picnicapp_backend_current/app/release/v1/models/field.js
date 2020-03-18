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

const fieldSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    fieldId : String,
    fieldName : String,
    parkId: String,
    fieldCoordinate : pointSchema,
    fieldPhotos : [],
    fieldSchedule : [],
    lastUpdatedBy : String,
    editedBy : []               // holds the list of Ids who edited the details 
},
{
    timestamps: true, // add created_at , updated_at at the time of insert/update
    versionKey: false 
})

fieldSchema.pre('save', async function (next) {
    var field = this;
    if (this.isNew) {
        try {            
            field._id = new mongoose.Types.ObjectId();
            field.fieldId = await autoId.autogenerateId('FLD');
            return next();
        } catch (error) {
            return next(error);
        }

    } else {
        return next();
    }
})


const Field = mongoose.model("Field", fieldSchema)

module.exports = Field




