import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

export const createRoom = async (roomData) => {
    return await prisma.room.create({
        data: roomData
    })
}

export const createRoomType = async (roomTypeData) => {
    return await prisma.roomType.create({
        data: roomTypeData
    })
}
export const createBranchRoomType = async (branchRoomTypeData) => {
    return await prisma.branchRoomType.create({
        data: branchRoomTypeData
    })
}

export const findBranchRoomType = async (branchId, roomTypeId) => {
  return await prisma.branchRoomType.findUnique({
    where: { branchId_roomTypeId: { branchId, roomTypeId } }
  })
}

export const updateBranchRoomType = async (branchId, roomTypeId, updatedData) => {
    return await prisma.branchRoomType.update({ //to customize prices per branch when needed
        where: { branchId_roomTypeId: { branchId, roomTypeId } },
        data: { ...updatedData }
    })
}

export const getRoomById = async (id) => {
    return await prisma.room.findUnique({
        where: { id }
    })
}

export const getRoomTypeById = async (id) => {
    return await prisma.roomType.findUnique({
        where: { id }
    })
}

export const getRoomByNumber = async (branchId, number) => {
    return await prisma.room.findUnique({
        where: {
            branchId_number: {
                branchId,
                number
            }
        }
    })
}

export const getRoomTypeByName = async (name) => {
    return await prisma.roomType.findUnique({
        where: { name }
    })
}

export const updateRoom = async (id, updatedData) => {
    return await prisma.room.update({
        where: { id },
        data: updatedData
    })
}

export const updateRoomType = async (id, updatedData) => {
    return await prisma.roomType.update({
        where: { id },
        data: updatedData
    })
}

export const deleteRoom = async (id) => {
    return await prisma.room.delete({
        where: { id }
    })
}

export const deleteRoomType = async (id) => {
    return await prisma.roomType.delete({
        where: { id }
    })
}

export const findAllRoomTypesByBranchId = async (branchId) => {
    return await prisma.branchRoomType.findMany({
        where: { branchId },
        include: {
            roomType: true,
            branch: {
                select: { name: true, location: true }
            }
        }
    })
}

export const findRoomTypeByIdAndBranchId = async (branchId, roomTypeId) => {
    return await prisma.branchRoomType.findUnique({
        where: {
            branchId_roomTypeId: {
                branchId,
                roomTypeId
            }
        },
        include: {
            roomType: true,
            branch: {
                select: { name: true, location: true }
            }
        }
    })
}

export const getBranchById = async (id) => {
    return await prisma.branch.findUnique({
        where: { id }
    })
}