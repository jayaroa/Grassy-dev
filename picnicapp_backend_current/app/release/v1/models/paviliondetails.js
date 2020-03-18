const mongoose = require('mongoose');
const autoId = require('../../../services/AutogenerateId');


const pavilionDetailsSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    pdetailsId : {
        type : String
    },
    pdetailsName : { 
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

pavilionDetailsSchema.pre('save', async function (next) {
    var pdetails = this;
    if (this.isNew) {
        try {            
            pdetails._id = new mongoose.Types.ObjectId();
            pdetails.pdetailsId = await autoId.autogenerateId('PDE');
            return next();
        } catch (error) {
            return next(error);
        }

    } else {
        return next();
    }
})


const Paviliondetails = mongoose.model("Paviliondetails", pavilionDetailsSchema)

module.exports = Paviliondetails