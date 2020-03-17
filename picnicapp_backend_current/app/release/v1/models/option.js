const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    fieldname : String,
    isActive : {
        type : Boolean,
        enum : [true,false],
        default : false
    },
    language : String,
    values : [{
        isRemoved : {
            type : Boolean,
            enum : [true,false],
            default : false
        },
        id : Number,
        value : String
    }]
},
{
    timestamps: true, // add created_at , updated_at at the time of insert/update
    versionKey: false
})

 
const Option = mongoose.model("Option", optionSchema)

module.exports = Option