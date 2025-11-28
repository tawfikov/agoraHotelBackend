import * as branchService from './branch.service.js'
import { ForbiddenError, NotFoundError } from '../../utils/AppError.js'
import { createBranchSchema, updateBranchSchema } from './branch.validation.js'

export const getAll = async (req, res, next) => {
    try {
        const branches = await branchService.getBranches()
        res.status(200).json({ branches })
    } catch (err) {
        next(err)
    }
}

export const getById = async (req, res, next) => {
    const id = Number(req.params.id)
    console.log(typeof id)
    try {
        const branch = await branchService.getBranch(id)
        if (!branch) {
            throw new NotFoundError('Branch not found')
        }
        res.status(200). json({ branch })
    } catch (err) {
        next(err)
    }
}

export const createNew = async (req, res, next) => {
    try {
        const zoddedBranch = createBranchSchema.parse(req.body)
        const newBranch = await branchService.createBranch(zoddedBranch)
        res.status(201).json({ newBranch })
    } catch (err) {
        next(err)
    }
}

export const deleteBranch = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
        const deleteBranch = await branchService.deleteBranch(id)
        res.status(204).json({ deleteBranch })
    } catch (err) {
        next(err)
    }
}

export const updateBranch = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
        const zoddedBranch = updateBranchSchema.parse(req.body)
        const updatedBranch = await branchService.updateBranch(id, zoddedBranch)
        res.status(200).json({ updatedBranch })
    } catch (err) {
        next(err)
    }
}