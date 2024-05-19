const jwt = require("jsonwebtoken");

// verify token
function verifyToken(req, res, next) {
    const authToken = req.headers.authorization
    if (authToken) {
        const token = authToken.split(" ")[1]
        try {
            //هنا يفتح التشفير
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
            req.userToken = decodedPayload
            next()

        } catch (e) {
            return res.status(401).json({message: "invalid token, access denied"})

        }
    } else {
        return res.status(401).json({message: "No Token, access denied"})
    }

}

// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.userToken.isAdmin) {
            next()
        } else {
            return res.status(403).json("You Not Admin!")

        }
    })
}// verify Token And Only User
function verifyTokenAndOnlyUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.userToken.id === req.params.id) {
            next()
        } else {
            return res.status(403).json("Not Allowed ony user")

        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser
}