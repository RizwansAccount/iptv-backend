import jwt from "jsonwebtoken";

const authenticate =(req, res, next)=>{
    const token = req.header('authorization');
    if(!token) {
        return res.json({ status: 401, response: "Unauthorized", message : "Access denied. No token provided."});
    };

    const bearerToken = token.split(" ")[1];

    try {
        const decoded = jwt.verify(bearerToken, process.env.TOKEN_USER_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        res.status(400).send('Invalid token!')
    }
};

export default authenticate;