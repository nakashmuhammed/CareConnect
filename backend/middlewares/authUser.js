
import jwt from 'jsonwebtoken';

// User authentication middleware
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not Authorized. Login again'
            });
        }

        const token_decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.body = req.body || {};
        req.body.userId = token_decode.id;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export default authUser;
