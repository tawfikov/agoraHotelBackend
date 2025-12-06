import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

export const findBookingById = async (id) => {
  return await prisma.booking.findUnique({
    where: { id }
    
  })
}

export const createPayment = async (paymentData) => {
  return await prisma.payment.create({
    data: paymentData
  })
}