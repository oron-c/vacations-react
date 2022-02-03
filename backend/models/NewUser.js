const Joi = require("joi");

class NewUser {
    constructor(username, password, firstName, lastName) {    
    if(arguments.length === 4){      
        this.username = username    
        this.password = password       
        this.firstName = firstName    
        this.lastName = lastName    
    }
    else if(arguments.length === 1) {
        const user = arguments[0];       
        this.username = user.username;          
        this.password = user.password;         
        this.firstName = user.firstName;
        this.lastName = user.lastName;          
    }
    else
        throw "NewUser structure error";
    }

    static #validationScheme = Joi.object({   
        firstName: Joi.string().min(4).max(25).required(),    
        lastName: Joi.string().min(4).max(25).required(),         
        username: Joi.string().min(4).max(25).required(),
        password: Joi.string().min(4).max(25).required(),


    })

    validate() {
        const result = NewUser.#validationScheme.validate(this, {abortEarly: false});
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

module.exports = NewUser