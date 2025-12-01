import * as branchRepo from './branch.repo.js'
import { ConflictError, NotFoundError } from '../../utils/AppError.js'

const normalizeImgUrls = (imgUrls) => {
    if (!imgUrls) return undefined
    return Array.isArray(imgUrls) ? imgUrls : [imgUrls]
}

export const getBranches = async () => {
    const branches = await branchRepo.getAllBranches()
    return branches
}

export const getBranch = async (id) => {
    const branch = await branchRepo.getBranchById(id)
    return branch
}

export const createBranch = async (branchDto) => {
    const exists = await branchRepo.getBranchByName(branchDto.name)
    if (exists) {
        throw new ConflictError('Branch with same name already exists.')
    }
    const normalized = normalizeImgUrls(branchDto.imgUrls)
    if (normalized) {
        branchDto.imgUrls = normalized
    }
    const newBranch = await branchRepo.createBranch(branchDto)
    return newBranch
}

export const deleteBranch = async (id) => {
    const branch = await branchRepo.getBranchById(id)
    if (!branch) {
        throw new NotFoundError('Branch not found!')
    }
    await branchRepo.deleteBranch(id)
    return { message: `${branch.name} has been deleted successfully`}
}

export const updateBranch = async (id, branchDto) => {
    const branch = await branchRepo.getBranchById(id)
    if (!branch) {
        throw new NotFoundError('Branch not found!')
    }

    if (branchDto.name && branchDto.name !== branch.name) { //re-check name duplication if changed
        const exists = await branchRepo.getBranchByname(branchDto.name)
        if (exists && exists.id !== id) {
            throw new ConflictError('Branch with same name already exists.')
        }
    }

    const normalized = normalizeImgUrls(branchDto.imgUrls)
    if (normalized && normalized.length > 0) { //if new imgs added 
        branchDto.imgUrls = { //push new imgs to the array
            push: normalized, //prisma syntax to push/merge arrays
        }
    }

    const updatedBranch = await branchRepo.updateBranch(id, branchDto)
    return updatedBranch
}