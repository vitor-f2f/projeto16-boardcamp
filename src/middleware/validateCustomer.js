import Joi from "joi";

const custSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .required(),
    cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
    birthday: Joi.date().iso().required(),
});

export const validateCustomer = (req, res, next) => {
    const { error } = custSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.message);
    }

    next();
};
