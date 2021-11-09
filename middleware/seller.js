module.exports = function (req, res, next) {
    if (!req.user.isSeller) return res.status(403).send("No Seller Token specified. Access Denied!")
    next()
}


