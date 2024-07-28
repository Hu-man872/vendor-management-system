
const jwt=require("jsonwebtoken");
const your_jwt_secret="123";

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, your_jwt_secret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
module.exports={authenticateJWT}