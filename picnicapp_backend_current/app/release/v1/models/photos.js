const mongoose = require('mongoose');
const autoId = require('../../../services/AutogenerateId');


const photosSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    photoId : {
        type : String
    },
    photoUrl : { 
        type : String
    },
    dateTaken : {
        type : Date,
        default : Date.now
    },
    uploadedBy : String,                // user Id
    entityId : String,
    entityType : {
        type : String,
        enum : ['PARK','PAVILION','FIELD'],
        default : 'PARK'
    }
},
{
    timestamps: true, // add created_at , updated_at at the time of insert/update
    versionKey: false 
})

photosSchema.pre('save', async function (next) {
    var photo = this;
    if (this.isNew) {
        try {            
            photo._id = new mongoose.Types.ObjectId();
            photo.photoId = await autoId.autogenerateId('PIC');
            return next();
        } catch (error) {
            return next(error);
        }

    } else {
        return next();
    }
})


const Photos = mongoose.model("Photos", photosSchema)

module.exports = Photos