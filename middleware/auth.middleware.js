import { AuthenticationError, ForbiddenError } from "../utils/AppError.js"
import { verifyAccessToken } from "../utils/jwt.js"


export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Access token not found.')
    }

    const token = authHeader.split(' ')[1]
    try {
        const verified = verifyAccessToken(token)
        if (!verified) {
            throw new AuthenticationError('Invalid access token.')
        }
        req.user = verified
        next()
    } catch (err) {
        next(err)
    }
}

export const adminOnly = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        throw new ForbiddenError('Admin access required.')
    }
    next()
}