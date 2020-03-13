const mongoose = require('mongoose');
const autoId = require('../../../services/AutogenerateId');


const globalDetailsSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    gdetailsId : {
        type : String
    },
    gdetailsName : { 
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

globalDetailsSchema.pre('save', async function (next) {
    var gdetails = this;
    if (this.isNew) {
        try {            
            gdetails._id = new mongoose.Types.ObjectId();
            gdetails.gdetailsId = await autoId.autogenerateId('GDE');
            return next();
        } catch (error) {
            return next(error);
        }

    } else {
        return next();
    }
})


const Globaldetails = mongoose.model("Globaldetails", globalDetailsSchema)

module.exports = Globaldetails