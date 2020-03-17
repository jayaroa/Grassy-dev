
const Autoidmodule= {
    autogenerateId: (request)=>{        
        var milliseconds = new Date().getTime();
        const finalId=request+milliseconds;
        return finalId;
    },    
}

module.exports = Autoidmodule;




        
