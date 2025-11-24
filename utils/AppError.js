export class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
    }
}

export class BadRequestError extends AppError {
    constructor(message)
 {
    super(message, 400) 
 }}

export class AuthenticationError extends AppError {
    constructor(message = 'Invalid credentials') {
        super(message, 401)
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404)
    }
}

export class TokenInvalidError extends AppError {
    constructor(message) {
        super(message, 401)
    }
}


export class TokenExpiredError extends AppError {
  constructor(message) {
    super(message, 401)
    }
}

export class TokenMismatchError extends AppError {
  constructor(message) {
    super(message, 401)
    }
}