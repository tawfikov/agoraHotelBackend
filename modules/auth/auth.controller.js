import { ZodError } from 'zod'
import { BadRequestError } from '../../utils/AppError.js'
import authService from './auth.service.js'
import { registerSchema, loginSchema } from './auth.validation.js'

const register = async (req, res, next) => {
    try {
        const zoddedData = registerSchema.parse(req.body)
        const user = await authService.register(zoddedData)

        if (!user) {
            throw new BadRequestError('User creation failed')
        }

        const safeUser = {
        email: user.email,
        username: user.username,
        name: user.name,
        phone: user.phone
        }
        res.status(201).json({ user: safeUser })
    } catch (err) {
        console.log(err.constructor.name)
        if (err.constructor.name === 'ZodError') {
            const message = err.message || 'Invalid input data'
            const error = new BadRequestError(message)
            return next(error)     
        }
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const zoddedData = loginSchema.parse(req.body)
        const result = await authService.login(zoddedData)
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true, //not accessible by JS
            secure: process.env.NODE_ENV === 'production', // false if in development (http), true if in production (https)
            sameSite: 'Strict', //CSRF protection
            maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
        })
        res.status(200).json({ accessToken: result.accessToken, user: result.user })
    } catch (err) {
        next(err)
    }
}

const refresh = async (req, res, next) => {
    try {
        const token= req.cookies.refreshToken
        const result = await authService.refresh(token)
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({ accessToken: result.accessToken })
    } catch (err) {
        next(err)
    }
}

const logout = async (req, res, next) => {
    try {
        const token= req.cookies.refreshToken
        await authService.logout(token)
        res.clearCookie("refreshToken")
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

const controller = { register, login, refresh, logout }
export default {
    register,
    login,
    refresh,
    logout
}