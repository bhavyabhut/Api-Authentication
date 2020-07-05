const joi = require("joi");

const validator = (schema) => {
	return (req, res, next) => {
		const result = schema.validate(req.body);
		console.log(result);
		if (result.error) return res.status(400).json(result.error);
		if (!req.value) req.value = {};
		req.value.body = req.body;
		next();
	};
};

const schema = joi.object({
	email: joi.string().email().required(),
	password: joi.string().required(),
});

module.exports = {
	validator,
	schema,
};
