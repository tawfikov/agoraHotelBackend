import * as roomRepo from './room.repo.js'
import { NotFoundError, ConflictError } from '../../utils/AppError.js'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

const normalizeImgUrls = (imgUrls) => {
    if (!imgUrls) return undefined
    return Array.isArray(imgUrls) ? imgUrls : [imgUrls]
}

const normalizedAmenities = (amenities) => {
    if (!amenities) return undefined
    return Array.isArray(amenities) ? amenities : [amenities]
}

export const createRoom = async (roomDto) => {
    const exists = await roomRepo.getRoomByNumber(roomDto.branchId, roomDto.number)
    if (exists) {
        throw new ConflictError('Room with same number already exists in this branch.')
    }
    
    const { branchId, roomTypeId } = roomDto
    
    // Room creation bundled with assigning room type to branch if not existing
    return await prisma.$transaction(async (tx) => {
        // Check if branch_roomType already exists
        const branchRoomTypeExists = await tx.branchRoomType.findUnique({
            where: {
                branchId_roomTypeId: {
                    branchId,
                    roomTypeId
                }
            }
        })
        //create if not exists
        if (!branchRoomTypeExists) {
            await tx.branchRoomType.create({ //inside transaction can't use roomRepo
                data: {
                    branchId,
                    roomTypeId
                }
            })
        }
        const newRoom = await tx.room.create({ //finally create room
            data: roomDto
        })
        return newRoom
    })
}

export const createRoomType = async(roomTypeDto) => {
    const normalized = normalizeImgUrls(roomTypeDto.imgUrls)
    if (normalized) {
        roomTypeDto.imgUrls = normalized
    }

    const amenities = normalizedAmenities(roomTypeDto.amenities)
    if (amenities) {
        roomTypeDto.amenities = amenities
    }
    const newRoomType = await roomRepo.createRoomType(roomTypeDto)
    return newRoomType
}

export const updateRoom = async (id, roomDto) => {
    const room = await roomRepo.getRoomById(id)
    if (!room) {
        throw new NotFoundError('Room not found!')
    }
    if (roomDto.number && roomDto.number !== room.number) {
        const existingRoom = await roomRepo.getRoomByNumber(room.branchId, roomDto.number)
        if (existingRoom && existingRoom.id !== id) {
            throw new ConflictError('Room with same number already exists in this branch.')
        }
    }
    const updatedRoom = await roomRepo.updateRoom(id, roomDto)
    return updatedRoom
}

export const updateRoomType = async (id, roomTypeDto) => {
    const roomType = await roomRepo.getRoomTypeById(id)
    if (!roomType) {
        throw new NotFoundError('Room type not found!')
    }
    if (roomTypeDto.name && roomTypeDto.name !== roomType.name) {
        const existingRoomType = await roomRepo.getRoomTypeByName(roomTypeDto.name)
        if (existingRoomType && existingRoomType.id !== id) {
            throw new ConflictError('Room type with same name already exists.')
        }
    }

    const normalized = normalizeImgUrls(roomTypeDto.imgUrls)
    if (normalized && normalized.length > 0) {
        roomTypeDto.imgUrls = {
            push: normalized
        }
    }
    const amenities = normalizedAmenities(roomTypeDto.amenities)
    if (amenities) {
        roomTypeDto.amenities = {
            push: amenities
        }
    }

    const updatedRoomType = await roomRepo.updateRoomType(id, roomTypeDto)
    return updatedRoomType
}

export const deleteRoom = async (id) => {
    const room = await roomRepo.getRoomById(id)
    if (!room) {
        throw new NotFoundError('Room not found!')
    }
    await roomRepo.deleteRoom(id)
    return { message: `Room ${room.number} has been deleted successfully` }
}

export const deleteRoomType = async (id) => {
    const roomType = await roomRepo.getRoomTypeById(id)
    if (!roomType) {
        throw new NotFoundError('Room type not found!')
    }
    await roomRepo.deleteRoomType(id)
    return { message: `Room type ${roomType.name} has been deleted successfully` }
}

export const getAllRoomTypesByBranchId = async (branchId) => {
    const branch = await roomRepo.getBranchById(branchId)
    if (!branch) {
        throw new NotFoundError('Branch not found!')
    }
    const roomTypes = await roomRepo.findAllRoomTypesByBranchId(branchId)
    return roomTypes
}

export const getRoomType = async (branchId, roomTypeId) => {
    const branchRoomType = await roomRepo.findRoomTypeByIdAndBranchId(branchId, roomTypeId)
    if (!branchRoomType) {
        throw new NotFoundError('Room type not found for this branch!')
    }
    return branchRoomType
}