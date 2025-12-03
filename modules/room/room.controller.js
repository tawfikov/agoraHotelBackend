import { createRoomSchema, createRoomTypeSchema, updateRoomSchema, updateRoomTypeSchema } from "./room.validation.js"
import * as roomService from './room.service.js'


export const createRoom = async (req, res, next) => {
    try {
        const zoddedRoom = createRoomSchema.parse(req.body)
        const newRoom = await roomService.createRoom(zoddedRoom)
        res.status(201).json({ newRoom})
    } catch (err) {
        next(err)
    }
}

export const createRoomType = async (req, res, next) => {
    try {
        const zoddedRoomType = createRoomTypeSchema.parse(req.body)
        const newRoomType = await roomService.createRoomType(zoddedRoomType)
        res.status(201).json({ newRoomType })
    } catch(err) {
        next(err)
    }
}

export const updateRoom = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
        const zoddedRoom = updateRoomSchema.parse(req.body)
        const updatedRoom = await roomService.updateRoom(id, zoddedRoom)
        res.status(200).json({ updatedRoom })
    } catch (err) {
        next(err)
    }
}

export const updateRoomType = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
        const zoddedRoomType = updateRoomTypeSchema.parse(req.body)
        const updatedRoomType = await roomService.updateRoomType(id, zoddedRoomType)
        res.status(200).json({ updatedRoomType })
    } catch (err) {
        next(err)
    }
}

export const deleteRoom = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
        const result = await roomService.deleteRoom(id)
        res.status(200).json(result)
    } catch (err) {
        next(err)
    }
}

export const deleteRoomType = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
        const result = await roomService.deleteRoomType(id)
        res.status(200).json(result)
    } catch (err) {
        next(err)
    }
}

export const getAllRoomTypes = async (req, res, next) => {
    const branchId = Number(req.params.branchId)
    try {
        const branchRoomTypes = await roomService.getAllRoomTypesByBranchId(branchId)
        res.status(200).json({ branchRoomTypes })
    } catch (err) {
        next(err)
    }
}

export const getRoomType = async (req, res, next) => {
    const branchId = Number(req.params.branchId)
    const roomTypeId = Number(req.params.roomTypeId)
    try {
        const branchRoomType = await roomService.getRoomType(branchId, roomTypeId)
        res.status(200).json({ branchRoomType })
    } catch(err) {
        next(err)
    }
}