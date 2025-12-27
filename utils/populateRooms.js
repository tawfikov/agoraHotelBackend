import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

const BRANCH_IDS = [1, 2, 3, 4]
const ROOM_TYPE_IDS = [1, 2, 3, 4]
const FLOORS = [0, 1, 2] // keep numbers short; last digit encodes room type

const roomsToCreate = BRANCH_IDS.flatMap((branchId) =>
  FLOORS.flatMap((floor) =>
    ROOM_TYPE_IDS.map((roomTypeId) => ({
      branchId,
      roomTypeId,
      number: `${branchId}${floor}${roomTypeId}`
    }))
  )
)

async function main() {
  const [existingBranches, existingRoomTypes] = await Promise.all([
    prisma.branch.findMany({ where: { id: { in: BRANCH_IDS } }, select: { id: true } }),
    prisma.roomType.findMany({ where: { id: { in: ROOM_TYPE_IDS } }, select: { id: true } })
  ])

  const missingBranches = BRANCH_IDS.filter(
    (id) => !existingBranches.some((branch) => branch.id === id)
  )
  const missingRoomTypes = ROOM_TYPE_IDS.filter(
    (id) => !existingRoomTypes.some((roomType) => roomType.id === id)
  )

  if (missingBranches.length || missingRoomTypes.length) {
    if (missingBranches.length) {
      console.warn(`Missing branches (ids): ${missingBranches.join(', ')}`)
    }
    if (missingRoomTypes.length) {
      console.warn(`Missing room types (ids): ${missingRoomTypes.join(', ')}`)
    }
    console.warn('Aborting room population because of missing references.')
    return
  }

  const result = await prisma.room.createMany({
    data: roomsToCreate,
    skipDuplicates: true
  })

  console.log(
    `Rooms attempted: ${roomsToCreate.length}; created: ${result.count}; skipped (duplicates): ${
      roomsToCreate.length - result.count
    }`
  )
}

main()
  .catch((error) => {
    console.error('populateRooms failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
