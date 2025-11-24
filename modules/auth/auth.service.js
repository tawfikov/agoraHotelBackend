import { createUser, revokeRefreshToken, saveRefreshToken, findUserByIdentifier, findUserByUsername, findRefreshToken, findUserByEmail } from './auth.repo.js'
import { hashPassword, comparePassword} from '../../utils/hash.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js'
import { TokenInvalidError, TokenExpiredError, TokenMismatchError, AuthenticationError, BadRequestError } from '../../utils/AppError.js'

const register = async (userDto) => {
    const emailExist = await findUserByEmail(userDto.email)
    if (emailExist) {
        throw new BadRequestError('Email already exists')
    }
    const usernameExist = await findUserByUsername(userDto.username)
    if (usernameExist) {
        throw new BadRequestError('Username already exists')
    }

    const hash = await hashPassword(userDto.password)
    const user = await createUser({...userDto, hashedPassword: hash })
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        phone: user.phone,
        role: user.role
    }
}

const login = async ({ username, email, password }) => {
    const identifier = email || username
    const user = await findUserByIdentifier(identifier) //email or username
    if (!user) throw new AuthenticationError('Wrong credentials')
    const isMatch = await comparePassword(password, user.hashedPassword)
    if (!isMatch) throw new AuthenticationError('Wrong credentials')
    
    const accessToken = generateAccessToken({ sub: user.id, role: user.role })
    const refreshToken = generateRefreshToken({ sub: user.id })
    
    await saveRefreshToken({ userId: user.id, token: refreshToken })
    
    return { accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            phone: user.phone,
            role: user.role
        }
    }
}

const refresh = async (refreshToken) => {
    let payload
    try {
        payload = verifyRefreshToken(refreshToken) //valid jwt token
    } catch (err) {
        throw new TokenInvalidError('Invalid refresh token')
    }
    const storedToken = await findRefreshToken(refreshToken) //check validity in db
    if (!storedToken || storedToken.revoked) {
        throw new TokenExpiredError('Expired refresh token')
    }
    if (payload.sub !== storedToken.userId) {
        throw new TokenMismatchError('Token mismatch')
    }

    const userId = storedToken.userId;
    const newAccess = generateAccessToken({ sub: userId })
    const newRefresh = generateRefreshToken({ sub: userId }) //refresh token rotation

    await revokeRefreshToken(refreshToken)
    await saveRefreshToken({ userId: userId, token: newRefresh })

    return {
        accessToken: newAccess,
        refreshToken: newRefresh
    }
}


const logout = async (refreshToken) => {
    await revokeRefreshToken(refreshToken)
}

export default {
    register,
    login,
    refresh,
    logout
}
