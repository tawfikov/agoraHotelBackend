import { NotFoundError, BadRequestError } from '../../utils/AppError.js'
import * as bookingRepo from './booking.repo.js'

export const createBooking = async (bookingDto) => {
    const {branchId, roomTypeId, userId } = bookingDto
    //removable: alread coerced in zod validation
    const checkOut = new Date(bookingDto.checkOut)
    const checkIn = new Date(bookingDto.checkIn)

    const now = new Date()
    if (checkIn < now) {
        throw new BadRequestError('Check-in date must be in the future')
    }
    if (checkOut <= checkIn) {
        throw new BadRequestError('Check-out date must be after check-in date')
    }
    //find all rooms in with required type and branch
    const candidateRooms = await bookingRepo.findRoomsToBook(branchId, roomTypeId)
    console.log(candidateRooms)
    if (!candidateRooms.length) {
        throw new NotFoundError('No rooms available right now. Please choose another room type.')
    }
    //find all bookings with same branch and room type that overlap with required dates
    const existingBookings = await bookingRepo.findBookingsByBranchIdAndRoomTypeId(branchId, roomTypeId, checkIn, checkOut)
    //extract room ids to be excluded
    const bookedRoomIds = new Set(existingBookings.map(b => b.roomId)) //removes duplicate ids, accelerates lookup
    //filter out booked rooms from candidate rooms
    const availableRoom = candidateRooms.find(r => !bookedRoomIds.has(r.id))
    if (!availableRoom) {
        throw new NotFoundError('No rooms available right now. Please choose another room type.')
    }

    //for pricing, pick the higher between base price and branch-specific price
    const nights = Math.ceil((checkOut-checkIn)/(1000*3600*24))
    const type = await bookingRepo.findRoomTypeById(roomTypeId)
    const branchType = await bookingRepo.findBranchRoomType(branchId, roomTypeId)
    const totalPrice = Math.max(type.price, branchType?.price) * nights
    const booking = await bookingRepo.createBooking({
        branchId,
        roomTypeId,
        userId,
        checkIn,
        checkOut,
        roomId: availableRoom.id,
        totalPrice
    })
    return booking
}

export const searchRoomTypes = async (searchDto) => {
    const search = await bookingRepo.searchRoomTypes(searchDto.guests, searchDto.branchId)
    return search
}

export const pricingRoomType = async (pricingDto) => {
  const { branchId, roomTypeId } = pricingDto

  const checkIn = new Date(pricingDto.checkIn)
  const checkOut = new Date(pricingDto.checkOut)

  const now = new Date()
  if (checkIn < now) {
    throw new BadRequestError("Check-in date must be in the future")
  }
  if (checkOut <= checkIn) {
    throw new BadRequestError("Check-out date must be after check-in date")
  }

  return calculateBookingPrice({
    branchId,
    roomTypeId,
    checkIn,
    checkOut,
    bookingRepo,
  })
}

export const calculateBookingPrice = async ({
  branchId,
  roomTypeId,
  checkIn,
  checkOut
}) => {
  const nights = Math.ceil(
    (checkOut - checkIn) / (1000 * 60 * 60 * 24)
  )

  const type = await bookingRepo.findRoomTypeById(roomTypeId)
  const branchType = await bookingRepo.findBranchRoomType(branchId, roomTypeId)

  if (!type) {
    throw new NotFoundError("Room type not found")
  }

  const pricePerNight = Math.max(type.price, branchType?.price ?? 0)

  return {
    nights,
    pricePerNight,
    totalPrice: pricePerNight * nights,
  }
}

export const getBookingHistory = async (userId) => {
  return bookingRepo.getBookingsByUserId(userId)
}

export const getBookingMetrics = async () => {
  const [
    totalRevenue,
    revenueThisMonth,
    totalBookings,
    bookingsPerBranchRaw,
    roomsPerBranchRaw,
    activeBookings,
  ] = await Promise.all([
    bookingRepo.getTotalRevenue(),
    bookingRepo.getRevenueThisMonth(),
    bookingRepo.getTotalBookings(),
    bookingRepo.getBookingsPerBranch(),
    bookingRepo.getRoomsPerBranch(),
    bookingRepo.getActiveBookingsWithRooms(),
  ])

  const branchIds = bookingsPerBranchRaw.map(b => b.branchId)
  const branches = await bookingRepo.getBranchesByIds(branchIds)
  const branchLookup = new Map(branches.map(b => [b.id, b]))

  const bookingsPerBranch = bookingsPerBranchRaw.map(({ branchId, _count }) => {
    const branch = branchLookup.get(branchId)
    return {
      branchId,
      branchName: branch?.name ?? null,
      branchLocation: branch?.location ?? null,
      bookings: _count._all,
    }
  })

  const roomsByBranch = new Map(roomsPerBranchRaw.map(r => [r.branchId, r._count.id]))
  const occupiedRoomsByBranch = new Map()
  
  for (const b of activeBookings) {
    const set = occupiedRoomsByBranch.get(b.branchId) ?? new Set()
    set.add(b.roomId)
    occupiedRoomsByBranch.set(b.branchId, set)
  }

  const occupancyPerBranch = Array.from(roomsByBranch.entries()).map(([branchId, totalRooms]) => {
    const occupied = occupiedRoomsByBranch.get(branchId)?.size ?? 0
    const occupancyRate = totalRooms > 0 ? occupied / totalRooms : 0
    return { branchId, occupiedRooms: occupied, totalRooms, occupancyRate }
  })


  return {
    totalRevenue,
    revenueThisMonth,
    totalBookings,
    bookingsPerBranch,
    occupancyPerBranch,
  }
}

