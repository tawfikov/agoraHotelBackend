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

export const updateBookingStatus = async (bookingId, status) => {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  })
}

export const searchRoomTypes = async(guests, branchId) => {
    return await prisma.roomType.findMany({
        where: {
            capacity: { gte: guests },
            branchRoomTypes: {
            some: { branchId },
            },
            rooms: {
                some: {
                    branchId
                }
            }
        },
        select: {
            id: true,
            name: true,
            capacity: true,
            price: true,
            amenities: true,
            imgUrls: true,
            description: true,
        },
    })
}

export const getBookingsByUserId = async (userId) => {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
        id: true,
        branchId: true,
        roomTypeId: true,
        roomId: true,
        checkIn: true,
        checkOut: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        room: {
            select: {
                number: true,
                roomType: {
                    select: { id: true, name: true, capacity: true }
                },
                branch: {
                    select: { id: true, name: true, location: true }
                }
            }
        }
    }
  })
}
