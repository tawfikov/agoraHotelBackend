import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

async function main() {
  const branches = await prisma.branch.findMany()
  const roomTypes = await prisma.roomType.findMany()

  const mappings = []

  for (const branch of branches) {
    for (const roomType of roomTypes) {
      mappings.push({
        branchId: branch.id,
        roomTypeId: roomType.id
      })
    }
  }

  if (mappings.length > 0) {
    await prisma.branchRoomType.createMany({
      data: mappings,
      skipDuplicates: true
    })
  }

  console.log('BranchRoomType population complete')
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
