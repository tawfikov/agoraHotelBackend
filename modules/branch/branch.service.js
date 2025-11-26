import * as branchRepo from './branch.repo.js'
import { ConflictError } from '../../utils/AppError.js'

export const getBranches = async () => {
    const branches = await branchRepo.getAllBranches()
    return branches
}

export const getBranch = async (id) => {
    const branch = await branchRepo.getBranchById(id)
    return branch
}

export const createBranch = async (branchDto) => {
    const exists = await branchRepo.getBranchByname(branchDto.name)
    if (exists) {
        throw new ConflictError('Branch with same name already exists.')
    }
    const newBranch = await branchRepo.createBranch(branchDto)
    return newBranch
}