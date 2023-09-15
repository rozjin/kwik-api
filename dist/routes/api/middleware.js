import passport from "passport";
const middleware = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, ({ err, user, info, status }) => {
        if (err)
            return next(err);
        if (!user) {
            res.status(401);
            return res.json({
                status: "error",
                data: {
                    message: "Unauthorized"
                }
            });
        }
        req.user = user;
        return next();
    })(req, res, next);
};
export default middleware;
