module.exports = function (req, res, next) {
    if (!req.user.isSp) return res.status(403).send("Access Denied!")
    next()
}