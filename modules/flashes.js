require('connect-flash');

exports.flashMessage = function (req, res, next) {
    res.locals.flashes = req.flash();
    next();
}