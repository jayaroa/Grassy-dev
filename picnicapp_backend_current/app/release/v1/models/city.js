const mongoose = require('mongoose');
const autoId = require('../../../services/AutogenerateId');


const citySchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    cityId : String,
    cityName : {
        type : String,
        uppercase : true
    },
    state: String,
    contactPersonId : String,
    contactPersonName : String,
    contactPersonPhone : { 
        type: String,
        get : v => parseInt(v),
        trim: true,
        match : [/^(\+\d{1,3}[- ]?)?\d{10}$/,'Please fill valid mobile number'],
        validate: {
            validator: function() {
              return new Promise((res, rej) =>{
                User.findOne({mobile: this.mobile,_id: {$ne: this._id}})
                    .then(data => {
                        if(data) {
                            res(false)
                        } else {
                            res(true)
                        }
                    })
                    .catch(err => {
                        res(false)
                    })
              })
            }, message: 'Mobile Already Taken'
          } 
    },
    contactPersonEmail : { 
        type: String, 
        lowercase: true, 
        trim: true,
        match : [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,'Please fill valid email address'],
        validate: {
            validator: function() {
              return new Promise((res, rej) =>{
                User.findOne({email: this.email,_id: {$ne: this._id}})
                    .then(data => {
                        if(data) {
                            res(false)
                        } else {
                            res(true)
                        }
                    })
                    .catch(err => {
                        res(false)
                    })
              })
            }, message: 'Email Already Taken'
          } 
    },
    supportPhone : { 
        type: String,
        get : v => parseInt(v),
        trim: true,
        match : [/^(\+\d{1,3}[- ]?)?\d{10}$/,'Please fill valid mobile number'],
        validate: {
            validator: function() {
              return new Promise((res, rej) =>{
                User.findOne({mobile: this.mobile,_id: {$ne: this._id}})
                    .then(data => {
                        if(data) {
                            res(false)
                        } else {
                            res(true)
                        }
                    })
                    .catch(err => {
                        res(false)
                    })
              })
            }, message: 'Mobile Already Taken'
          } 
    },
    supportEmail : { 
        type: String, 
        lowercase: true, 
        trim: true,
        match : [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,'Please fill valid email address'],
        validate: {
            validator: function() {
              return new Promise((res, rej) =>{
                User.findOne({email: this.email,_id: {$ne: this._id}})
                    .then(data => {
                        if(data) {
                            res(false)
                        } else {
                            res(true)
                        }
                    })
                    .catch(err => {
                        res(false)
                    })
              })
            }, message: 'Email Already Taken'
          } 
    },
    parksList : [],   
    isRemoved :{
        type: Boolean,
        default : false
    }
},
{
    timestamps: true, // add created_at , updated_at at the time of insert/update
    versionKey: false 
})

citySchema.pre('save', async function (next) {
    var city = this;
    if (this.isNew) {
        try {            
            city._id = new mongoose.Types.ObjectId();
            city.cityId = await autoId.autogenerateId('CIT');
            return next();
        } catch (error) {
            return next(error);
        }

    } else {
        return next();
    }
})


const City = mongoose.model("City", citySchema)

module.exports = City




