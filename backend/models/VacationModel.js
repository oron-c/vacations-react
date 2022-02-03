const Joi = require("joi");

class VacationModel {
    constructor(description, destinationId, image, 	dateStart, dateEnd, price, followers) {    
    if(arguments.length === 7){
        this.description = description;        
        this.destinationId = destinationId;
        this.image = image;        
        this.dateStart = dateStart;      
        this.dateEnd = dateEnd;      
        this.price = price;      
        this.followers = followers;      
    }
    else if(arguments.length === 1) {
        const vacation = arguments[0];
        this.description = vacation.description;        
        this.destinationId = vacation.destinationId;
        this.image = vacation.image;        
        this.dateStart = vacation.dateStart;      
        this.dateEnd = vacation.dateEnd;      
        this.price = vacation.price;      
        this.followers = vacation.followers;   
    }
    else
        throw "VacationModel structure error";
    }

    static #validationScheme = Joi.object({        
        description: Joi.string().required(),
        destinationId: Joi.number().min(0).required(),
        image: Joi.required(),
        dateStart: Joi.date().min(new Date().getFullYear()).required(),
        dateEnd: Joi.date().min(new Date().getFullYear()).required(),
        price: Joi.number().required().min(1),
        followers: Joi.number().required()
    })

    validate() {
        const result = VacationModel.#validationScheme.validate(this, {abortEarly: false});
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

module.exports = VacationModel