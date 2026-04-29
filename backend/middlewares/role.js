export const requireDriver = (req, res, next) => {
    if(req.user.role !== "driver"){
        return next(new AppError("Access denied! Driver only route", 403));

    }
    next();
}

export const requireRider = (req, res, next) => {
    if(req.user.role !== "rider") {
        return next(new AppError("Access denied! Rider only route", 403));

    }
    next();
};
