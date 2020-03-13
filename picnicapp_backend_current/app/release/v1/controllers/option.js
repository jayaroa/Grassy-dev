const bcrypt = require('bcrypt');
const token_gen = require('../../../services/jwt_token_generator');
const mongoose = require('mongoose');

const Option = require('../models/option')

let errorMsgJSON = require('../../../services/errors.json')
let lang = 'EN';
// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');
 
// Load method categories.
var array = require('lodash/array');
var object = require('lodash/fp/object');
 
// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');

module.exports = {

    
    /**
     * Add new options
     */
    addOption : async (req,res,next) =>{ 
        var optionValues;
        var modifiedOptions=[];  
        let modifiedOptions1=[]; 
        let existingOptions=[];       
        
        const fieldName = req.body.fieldname ? req.body.fieldname : next( {
            message: 'Please provide option field name'
        } ) 

        // const optionShortCode = req.body.shortcode ? req.body.shortcode : ''

        const language = req.body.language ? req.body.language : next( {
            message: errorMsgJSON[lang]['404']
        } ) 

        optionValues = req.body.values ? JSON.parse(req.body.values) :next( {
            message: errorMsgJSON[lang]['303']
        } ) 

        const isActive =  req.body.isActive ? false : true
              
        /**
         * Check duplicate values before adding and increment counter 
         * accordingly
         */
        
        await optionValues.map( (o,index) => {
            modifiedOptions1.push(o);
          }); 
          let index=0;
          await Option.findOne({'fieldname':req.body.fieldname,'language': language
        },  function(err, item) {
              if(item!==null){
              existingOptions=item.values.map(item1=>{
                  index=index+1
                  return item1.value;
                  })
              }
          }) 
          modifiedOptions1 =await  modifiedOptions1.filter(val => !existingOptions.includes(val));
          await modifiedOptions1.map((o) => {
              o = {id : index++,isRemoved : false,value : o}
              modifiedOptions.push(o);
          }); 


        // ---------------------



       
        // var i=0;
        // optionValues.map( (o,index) => {
        //     o = {id : i++,isRemoved : false,value : o}
        //     modifiedOptions.push(o);
        // });  

        
         // filling data into model 
        let newOptionObj = new Option({
            _id : new mongoose.Types.ObjectId(),
            isActive : isActive,
            fieldname : fieldName,             
            language : language,
            values : modifiedOptions
        })

        Option.find({ fieldname : fieldName,language : language},function(err,docs)
        {
            //if same document doesn't exist
            if(docs.length==0){
                newOptionObj.save().then(result => {
                    console.log(result);
                    if(result!={}){
                        res.json({                           
                            isError : false,
                            message: errorMsgJSON[lang]['201'],
                            statuscode : 200,
                            data :result                            
                        })
                    }
                    else{
                        res.json({
                            isError : true,
                            message: errorMsgJSON[lang]['404'],
                            statuscode : 404,
                            data :null
                        })
                    }            
                })
            }
            else{

                //Appending more values to the existing array

                let fullArr =[...modifiedOptions,...docs[0].values]
                idToUpdate = docs[0]._id.toString();
                var findById ={
                    _id : idToUpdate
                }

                var valueToUpdate = {$set:{
                    values : fullArr
                }}

                Option.updateOne(findById, valueToUpdate, function(err, result2) {
                    if(result2!={}){
                        res.json({
                            isError : false,
                            message: 'More Values added successfully', 
                            statuscode : 200,
                            data :null                                                                               
                        })
                    }
                    else{
                        res.json({
                            isError : true,
                            message: 'Some error occured',
                            statuscode : 409,
                            data:null
                          
                        })
                    }            
                })
            }
        })     
       
    },


    /**
     * Fetch all options
     */
    getAllOptions : (req,res,next) => {
        //get preffered language from header
        let language = req.headers.language ? req.headers.language : 'EN';
        
        var aggrQry = [
            {
                $match : {$and:[{language : language},{isActive : true}]}
            },
            {
                $project : {
                    _id : 0,
                    fieldname : 1,
                    values : 1
                }
            }

        ]

        Option.aggregate(aggrQry).exec((err, options) => {
            if (err) throw err;
            //console.log(options);
            var modifiedOptions=[];
            options.map((o)=>{
                let newObj = {[o.fieldname] : o.values}
               // console.log(newObj);
                modifiedOptions.push(newObj)
            })

            res.json({
                statuscode : 200,
                message: errorMsgJSON[lang]['200'],
                data: modifiedOptions,
                //newtoken : req.newToken
            })
        })

        
    },


  
    /**
     * Update option
     */
    updateOption : async (request,res,next) =>{
        let fieldname = request.body.fieldname ? request.body.fieldname :next({message: 'Please provide fieldname'}) 
        let id = request.body.id ? request.body.id :next({message: 'Please provide id'})
        let newvalue = request.body.newvalue ? request.body.newvalue :next({message: 'Please provide new value'})
       
        let findbyfieldname={'fieldname':fieldname};  
       await Option.findOne(findbyfieldname, function(err, item) {
               if(err){
                res.status(404).json({
                    message: 'error occures during update.please try again',
                    status:404
                })

               }
              if(item==null){
                res.status(404).json({
                    message: 'Field name does not exist',
                    status:404
                })

              }
            item.values.filter(opt => {
                if(opt.id==id){
                    let findwith={'id':opt.id,'value':fieldname};  
                    var updatevalueswith = {$set:{value:newvalue}};
                    Option.update(findwith,updatevalueswith , function(err, res1) {
                        console.log(res1)
                       
                    });
                    
                }
               
                
                 
                 
                
                
                });
               
              
            

              


            })
       



        
    },


    /**
     * Remove option
     */
    removeOption : (req,res,next) => {
        
    }
} 
