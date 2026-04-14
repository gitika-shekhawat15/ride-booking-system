export const requireDriver = (req, res, next) => {
    if(req.user.role !== "driver"){
        return res.status(403).json({
            message: "Access denied! Driver only route",

        });
    }
    next();
}

export const requireRider = (req, res, next) => {
    if(req.user.role !== "rider") {
       return res.status(403).json({
            message: "Access denied! Rider only route"
        });
    }
    next();
};
