const jwt = require('jsonwebtoken')
const User = require('../models/user')


const authorization = async (req, res, next) => {
try {
    const token = req.cookies.token
    const decodeToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findOne({ _id: decodeToken._id, 'tokens.token': token})
    
    if(!user){
        throw new Error()
    }

    req.user = user
    req.token = token
    next()
} 

catch (e) {
    res.boom.unauthorized('Authentication token not found')
}

}

module.exports = authorization