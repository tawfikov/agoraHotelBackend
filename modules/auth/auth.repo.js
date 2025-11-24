import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const findUserByUsername = async (username) => {
    return await prisma.user.findUnique({
        where: { username }
    })
}

export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    })
}

export const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id }
    })
}

export const findUserByIdentifier = async (identifier) => {
    return await prisma.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { username: identifier } //login is possible via email or username
            ]
        }
    })
}

export const createUser = async (userData) => {
    const { password, ...data } = userData
    return await prisma.user.create({
        data
    })
}

export const saveRefreshToken = async ({ userId, token }) => {
    return await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
    })
}

export const findRefreshToken = async (token) => {
    return await prisma.refreshToken.findUnique({
        where: { token }
    })
}   

export const revokeRefreshToken = async (token) => {
    return await prisma.refreshToken.update({
        where: { token },
        data: { revoked: true }
    })
}
