const Joi = require("joi");

class Credentials {

    constructor(credentials) {
        this.username = credentials.username;
        this.password = credentials.password;
    }

    static #validationSchema = Joi.object({
        username: Joi.string().required().min(4).max(50),
        password: Joi.string().required().min(4).max(50)
    });

    validate() {
        const result = Credentials.#validationSchema.validate(this, { abortEarly: false });
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

module.exports = Credentials;