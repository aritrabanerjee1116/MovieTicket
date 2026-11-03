class Validation {
    static validate(schema) {
        return (req, res, next) => {
            const { error, value } = schema.validate(req.body, {
                abortEarly: false, //Without this option, Joi stops at the first validation error. (//You get all errors:["Email is required", "Password must be at least 6 characters" ] This provides better feedback to API consumers.)
                stripUnknown: true,  //Removes properties that are not defined in the Joi schema. (Then after validation:emoved automatically.)
            });

            if (error) {
                return res.status(400).json({
                    success: false,
                    errors: error.details.map(err => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }

            req.body = value;
            next();
        };
    }
}

module.exports = Validation;