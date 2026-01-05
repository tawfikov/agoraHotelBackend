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

export const getTotalRevenue = async () => {
  const result = await prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: { status: { not: 'CANCELLED' } },
  })
  return result._sum.totalPrice
}

export const getRevenueThisMonth = async () => {
  const now = new Date()
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const startOfNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))

  const result = await prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: {
      status: 'CONFIRMED',
      createdAt: { gte: startOfMonth, lt: startOfNextMonth },
    },
  })
  return result._sum.totalPrice
}

export const getTotalBookings = async () => {
  return prisma.booking.count({
    where: { status: 'CONFIRMED' },
  })
}

export const getBookingsPerBranch = async () => {
  return prisma.booking.groupBy({
    by: ['branchId'],
    _count: { _all: true },
    where: { status: 'CONFIRMED' },
  })
}

export const getRoomsPerBranch = async () => {
  return prisma.room.groupBy({
    by: ['branchId'],
    _count: { id: true },
    where: { roomStatus: { not: 'MAINTENANCE' } },
  })
}

export const getActiveBookingsWithRooms = async () => {
  const now = new Date()
  return prisma.booking.findMany({
    where: {
      status: 'CONFIRMED' ,
      checkIn: { lte: now },
      checkOut: { gt: now },
    },
    select: { roomId: true, branchId: true },
  })
}

export const getBranchesByIds = async (branchIds) => {
  if (!branchIds.length) return []
  return prisma.branch.findMany({
    where: { id: { in: branchIds } },
    select: { id: true, name: true, location: true },
  })
}
