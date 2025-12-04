import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

export const createBooking = async (bookingData) => {
    return await prisma.booking.create({
        data: bookingData
    })
}

export const findRoomsToBook = async (branchId, roomTypeId) => {
    return await prisma.room.findMany({
        where: {
            branchId,
            roomTypeId,
            roomStatus: { not: 'MAINTENANCE' }
        }
    })
}

export const findBookingsByBranchIdAndRoomTypeId = async (branchId, roomTypeId, xIn, xOut) => {
    return await prisma.booking.findMany({
        where: {
            room: {
                branchId,
                roomTypeId,
            },
            status: { not: 'CANCELLED' }, // Exclude cancelled bookings
            AND: [
                { checkOut: { gt: xIn } },
                { checkIn: { lt: xOut } }
            ]
        }
    })
}

export const findRoomTypeById = async (id) => {
    return await prisma.roomType.findUnique({
        where: { id }
    })
}

export const findBranchRoomType = async (branchId, roomTypeId) => {
    return await prisma.branchRoomType.findUnique({
        where: {
            branchId_roomTypeId: {
                branchId,
                roomTypeId
            }
        }
    })
}