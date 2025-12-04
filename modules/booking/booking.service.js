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