const Joi = require("joi");

class DestinationModel {
    constructor(destinationId, destinationName) {    
    if(arguments.length === 2){      
        this.destinationId = destinationId;
        this.destinationName = destinationName    
    }
    else if(arguments.length === 1) {
        const destination = arguments[0];       
        this.destinationId = destination.destinationId;
        this.destinationName = destination.destinationName;          
    }
    else
        throw "DestinationModel structure error";
    }

    static #validationScheme = Joi.object({        
        destinationId: Joi.number().required(),
        destinationName: Joi.string().required(),
    })

    validate() {
        const result = DestinationModel.#validationScheme.validate(this, {abortEarly: false});
        if (result.error) {
            const errObj = {};
            for (const err of result.error.details) {
                errObj[err.context.key] = err.message;
            }
            return errObj
        }
        return null;
    }
}

module.exports = DestinationModel