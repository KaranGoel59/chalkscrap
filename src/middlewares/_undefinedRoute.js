export const undefinedRoute = ((req , res, next) => {
    const err = {
        status: 404,
        message: 'Not Found',
    };
    next(err);
});