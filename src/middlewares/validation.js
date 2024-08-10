const validate =(schema, source = 'body')=>{
    return (req, res, next) => {
        const { error } = schema.validate(req[source]);
        if (error) {
            return res.status(400).send(error?.details?.[0]?.message);
        }
        next();
    }
}

export default validate;