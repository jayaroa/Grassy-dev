const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const autoId = require('../../../services/AutogenerateId');

const userSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    userId : {
        type : String
    },
    aUserId : {
        type : String
    },
    name: {
        type: String
    },
    email : { 
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
    mobile : String,
    password : {
        type: String,
        required: true
    },
    otp : {
        type : Number        
    },
    userType : {
        type : String,
        enum : ['USER','CITY-MANAGER','SUPER-ADMIN'],
        default : 'USER'
    },
    isActive : {
        type : Boolean,
        enum : [true,false],
        default : false
    },
    isApproved : {
        type : Boolean,
        enum : [true,false],
        default : false
    },
    isLoggedIn : {
        type : Boolean,
        enum : [true,false],
        default : false
    },
    profileCreatedAt : { 
        type: Date,
        default: Date.now
    },
    userImage : String,
    cityName : String,
    cityId : String,
},
{
    timestamps: true, // add created_at , updated_at at the time of insert/update
    versionKey: false 
})

userSchema.pre('save', async function (next) {

    var user = this;
    if (this.isModified('password') || this.isNew) {

        try {
            var salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
            var hashed_password = await bcrypt.hash(user.password, salt)
            user.password = hashed_password;
            user._id = new mongoose.Types.ObjectId();
            let usrTypeBlock = this.userType == 'USER'?'USER':(this.userType=='CITY-MANAGER'?'CMGR':'ADMN')
            user.userId = await autoId.autogenerateId(usrTypeBlock);
            return next();
        } catch (error) {
            return next(error);
        }

    } else {
        return next();
    }
})

userSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw, this.password, function (err, isMatched) {
        if (err) return cb({"err from here":err})
        cb(null, isMatched)
    })
}


//Naming Convention For Model
// 1. WE have to name our model User for Users collection
// 2. model automatically add 's' after the name of the model name
// 3. do not use 's' at the end of the model name
// 4. if model is not present in the db when first time we add data to collection it will automatically create one.
// 5. if any field does not match with its model field type throw an exception so write catch block 
const User = mongoose.model("User", userSchema)

module.exports = User