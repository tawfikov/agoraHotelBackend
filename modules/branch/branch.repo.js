import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

export const createBranch = async (branchData) => {
    return await prisma.branch.create({
        data: branchData
    })
}

export const getAllBranches = async () => {
    return prisma.branch.findMany()
}

export const getBranchByname = async (name) => {
    return prisma.branch.findUnique({
        where: { name }
    })
}

export const getBranchById = async (id) => {
    return prisma.branch.findUnique({
        where: { id }
    })
}

export const updateBranch = async (id, updatedData) => {
    return await prisma.branch.update({
        where: { id },
        data: updatedData
    })
}

export const deleteBranch = async (id) => {
    return await prisma.branch.delete({
        where: { id}
    })
}