const errorHandler = (err,req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Some internal server error'
    res.status(statusCode).json({ message })
}

export default errorHandler